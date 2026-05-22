import type {
  ProviderTextResponse,
  RunTextGenerationInput,
} from "@/lib/ai/types";

type OpenRouterApiResponse = {
  id?: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
      reasoning?: string;
    };
  }>;
};

class OpenRouterHttpError extends Error {
  status: number;
  responseText: string;

  constructor(status: number, responseText: string) {
    super(`OpenRouter request failed: ${status} ${responseText}`);
    this.name = "OpenRouterHttpError";
    this.status = status;
    this.responseText = responseText;
  }
}

function getOpenRouterApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  return apiKey;
}

function extractTextContent(
  content: string | Array<{ type?: string; text?: string }> | undefined,
  reasoning?: string,
) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text ?? "")
      .join("")
      .trim();
  }

  return reasoning?.trim() ?? "";
}

function buildRequestBody(input: RunTextGenerationInput) {
  const requestBody: Record<string, unknown> = {
    model: input.modelConfig.model,
    messages: input.messages,
    temperature: input.temperature ?? 0.7,
    max_tokens: input.maxOutputTokens ?? 2200,
  };

  if (input.requireJsonResponse) {
    requestBody.response_format = {
      type: "json_object",
    };
  }

  return requestBody;
}

function normalizeErrorText(errorText: string) {
  const trimmed = errorText.trim();

  if (!trimmed) {
    return "Empty error response from OpenRouter.";
  }

  try {
    const parsed = JSON.parse(trimmed) as
      | {
          error?: { message?: string };
          message?: string;
          detail?: string;
        }
      | undefined;

    const message =
      parsed?.error?.message ?? parsed?.message ?? parsed?.detail ?? trimmed;

    return message.replace(/\s+/g, " ").trim();
  } catch {
    return trimmed.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

function shouldRetryWithCompatibilityMode(
  input: RunTextGenerationInput,
  error: OpenRouterHttpError,
) {
  return (
    input.modelConfig.model === "openrouter/free" ||
    input.requireJsonResponse ||
    error.status === 429 ||
    error.status >= 500
  );
}

function buildCompatibilityInput(input: RunTextGenerationInput) {
  const isFreeModel = input.modelConfig.model === "openrouter/free";

  return {
    ...input,
    requireJsonResponse: false,
    temperature: Math.min(input.temperature ?? 0.7, isFreeModel ? 0.5 : 0.6),
    maxOutputTokens: Math.min(
      input.maxOutputTokens ?? 2200,
      isFreeModel ? 1200 : 1800,
    ),
  } satisfies RunTextGenerationInput;
}

async function requestOpenRouter(
  input: RunTextGenerationInput,
  requestBody: Record<string, unknown>,
) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenRouterApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Ideas Generator",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = normalizeErrorText(await response.text());
    throw new OpenRouterHttpError(response.status, errorText);
  }

  const data = (await response.json()) as OpenRouterApiResponse;
  const choice = data.choices?.[0];
  const text = extractTextContent(
    choice?.message?.content,
    choice?.message?.reasoning,
  );

  return {
    data,
    text,
    finishReason: choice?.finish_reason ?? null,
    model: data.model ?? input.modelConfig.model,
  };
}

export async function runOpenRouterTextGeneration(
  input: RunTextGenerationInput,
): Promise<ProviderTextResponse> {
  let activeInput = input;
  let primaryResult;

  try {
    const primaryBody = buildRequestBody(activeInput);
    primaryResult = await requestOpenRouter(activeInput, primaryBody);
  } catch (error) {
    if (
      error instanceof OpenRouterHttpError &&
      shouldRetryWithCompatibilityMode(activeInput, error)
    ) {
      activeInput = buildCompatibilityInput(activeInput);
      const compatibilityBody = buildRequestBody(activeInput);
      primaryResult = await requestOpenRouter(activeInput, compatibilityBody);
    } else {
      throw error;
    }
  }

  if (!primaryResult.text) {
    const fallbackInput = buildCompatibilityInput(activeInput);
    const fallbackBody = buildRequestBody(fallbackInput);

    const fallbackResult = await requestOpenRouter(fallbackInput, fallbackBody);

    if (!fallbackResult.text) {
      throw new Error(
        `OpenRouter returned an empty response. finish_reason=${String(
          fallbackResult.finishReason ?? primaryResult.finishReason ?? "unknown",
        )}`,
      );
    }

    return {
      provider: "openrouter",
      model: fallbackResult.model,
      text: fallbackResult.text,
      usage: {
        promptTokens: fallbackResult.data.usage?.prompt_tokens,
        completionTokens: fallbackResult.data.usage?.completion_tokens,
        totalTokens: fallbackResult.data.usage?.total_tokens,
        providerRequestId: fallbackResult.data.id ?? null,
      },
    };
  }

  return {
    provider: "openrouter",
    model: primaryResult.model,
    text: primaryResult.text,
    usage: {
      promptTokens: primaryResult.data.usage?.prompt_tokens,
      completionTokens: primaryResult.data.usage?.completion_tokens,
      totalTokens: primaryResult.data.usage?.total_tokens,
      providerRequestId: primaryResult.data.id ?? null,
    },
  };
}
