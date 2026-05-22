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
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

function getOpenRouterApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  return apiKey;
}

function extractTextContent(
  content: string | Array<{ type?: string; text?: string }> | undefined,
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

  return "";
}

export async function runOpenRouterTextGeneration(
  input: RunTextGenerationInput,
): Promise<ProviderTextResponse> {
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
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as OpenRouterApiResponse;
  const text = extractTextContent(data.choices?.[0]?.message?.content);

  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    provider: "openrouter",
    model: data.model ?? input.modelConfig.model,
    text,
    usage: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
      providerRequestId: data.id ?? null,
    },
  };
}
