import { AiOperationType } from "@/generated/prisma/enums";
import { buildBuilderPrompt } from "@/lib/ai/agents/builderAgent";
import { buildCriticPrompt } from "@/lib/ai/agents/criticAgent";
import { buildDreamerPrompt } from "@/lib/ai/agents/dreamerAgent";
import { buildFinalEditorPrompt } from "@/lib/ai/agents/finalEditorAgent";
import { buildInvestorPrompt } from "@/lib/ai/agents/investorAgent";
import {
  buildMvpConceptPrompt,
  buildRealityCheckPrompt,
  buildRefineIdeaPrompt,
  getBaseSystemPrompt,
} from "@/lib/ai/prompts";
import { runOpenRouterTextGeneration } from "@/lib/ai/providers/openrouterProvider";
import {
  AI_MODELS,
  type AgentName,
  type AgentRunResult,
  type GenerateMvpConceptInput,
  type GenerateIdeasInput,
  type GenerateIdeasResult,
  type GeneratedIdea,
  type RealityCheckInput,
  type RefineIdeaInput,
} from "@/lib/ai/types";
import { combineUsage, createAiUsageLog, estimateCostUsd } from "@/lib/ai/usage";

function extractJsonCandidate(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    const fenced = trimmed
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    if (fenced) {
      return fenced;
    }
  }

  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");

  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  const arrayStart = trimmed.indexOf("[");
  const arrayEnd = trimmed.lastIndexOf("]");

  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    return trimmed.slice(arrayStart, arrayEnd + 1);
  }

  return trimmed;
}

function normalizeIdea(value: unknown): GeneratedIdea {
  const idea = value as Record<string, unknown>;
  const scores = (idea.scores ?? {}) as Record<string, unknown>;

  const toStringArray = (input: unknown) =>
    Array.isArray(input) ? input.filter((item): item is string => typeof item === "string") : [];

  return {
    title: typeof idea.title === "string" ? idea.title : "Untitled idea",
    shortDescription:
      typeof idea.shortDescription === "string"
        ? idea.shortDescription
        : "No short description provided.",
    fullDescription:
      typeof idea.fullDescription === "string" ? idea.fullDescription : undefined,
    category: typeof idea.category === "string" ? idea.category : undefined,
    targetAudience:
      typeof idea.targetAudience === "string" ? idea.targetAudience : undefined,
    problem: typeof idea.problem === "string" ? idea.problem : undefined,
    solution: typeof idea.solution === "string" ? idea.solution : undefined,
    monetization: toStringArray(idea.monetization),
    mvpFeatures: toStringArray(idea.mvpFeatures),
    risks: toStringArray(idea.risks),
    firstSteps: toStringArray(idea.firstSteps),
    scores: {
      overall: Number(scores.overall ?? 0),
      market: Number(scores.market ?? 0),
      feasibility: Number(scores.feasibility ?? 0),
      monetization: Number(scores.monetization ?? 0),
      personalFit: Number(scores.personalFit ?? 0),
    },
  };
}

function parseIdeasFromResponse(text: string) {
  const parsed = JSON.parse(extractJsonCandidate(text)) as unknown;

  if (Array.isArray(parsed)) {
    return parsed.map(normalizeIdea);
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "ideas" in parsed &&
    Array.isArray((parsed as { ideas: unknown[] }).ideas)
  ) {
    return (parsed as { ideas: unknown[] }).ideas.map(normalizeIdea);
  }

  throw new Error("AI response did not contain an ideas array.");
}

function parseIdeaFromResponse(text: string) {
  const parsed = JSON.parse(extractJsonCandidate(text)) as unknown;

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return normalizeIdea(parsed);
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    return normalizeIdea(parsed[0]);
  }

  throw new Error("AI response did not contain a valid idea object.");
}

async function runAgent(
  agentName: AgentName,
  prompt: string,
  input: GenerateIdeasInput,
) {
  const modelConfig = AI_MODELS[input.depth];

  try {
    const response = await runOpenRouterTextGeneration({
      modelConfig,
      messages: [
        { role: "system", content: getBaseSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature:
        input.depth === "free" ? 0.8 : input.depth === "draft" ? 0.9 : 0.7,
      maxOutputTokens: agentName === "finalEditor" ? 3200 : 1800,
      requireJsonResponse: agentName === "finalEditor",
    });

    const estimatedCostUsd =
      response.usage.estimatedCostUsd ?? estimateCostUsd(response.usage, modelConfig);

    const usage = {
      ...response.usage,
      estimatedCostUsd,
    };

    await createAiUsageLog({
      workspaceId: input.workspace.id,
      operationType: AiOperationType.GENERATE_IDEAS,
      provider: response.provider,
      model: response.model,
      status: "SUCCESS",
      promptTokens: usage.promptTokens ?? null,
      completionTokens: usage.completionTokens ?? null,
      totalTokens: usage.totalTokens ?? null,
      estimatedCostUsd,
      providerRequestId: usage.providerRequestId ?? null,
      agentName,
    });

    return {
      agentName,
      text: response.text,
      provider: response.provider,
      model: response.model,
      usage,
    } satisfies AgentRunResult;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown AI generation failure.";

    await createAiUsageLog({
      workspaceId: input.workspace.id,
      operationType: AiOperationType.GENERATE_IDEAS,
      provider: modelConfig.provider,
      model: modelConfig.model,
      status: "FAILED",
      errorMessage,
      agentName,
    });

    throw error;
  }
}

export async function generateIdeas(
  input: GenerateIdeasInput,
): Promise<GenerateIdeasResult> {
  const dreamer = await runAgent("dreamer", buildDreamerPrompt(input), input);
  const builder = await runAgent("builder", buildBuilderPrompt(input), input);
  const investor = await runAgent("investor", buildInvestorPrompt(input), input);
  const critic = await runAgent("critic", buildCriticPrompt(input), input);

  const finalEditor = await runAgent(
    "finalEditor",
    buildFinalEditorPrompt(input, {
      dreamer: dreamer.text,
      builder: builder.text,
      investor: investor.text,
      critic: critic.text,
    }),
    input,
  );

  const ideas = parseIdeasFromResponse(finalEditor.text);
  const usage = combineUsage(
    ...[dreamer, builder, investor, critic, finalEditor].map(
      (result) => result.usage,
    ),
  );

  return {
    ideas,
    usage,
    provider: finalEditor.provider,
    model: finalEditor.model,
    rawText: finalEditor.text,
  };
}

async function runSingleIdeaOperation(
  operationType: AiOperationType,
  prompt: string,
  input: RefineIdeaInput | GenerateMvpConceptInput,
) {
  const modelConfig = AI_MODELS[input.depth];

  try {
    const response = await runOpenRouterTextGeneration({
      modelConfig,
      messages: [
        { role: "system", content: getBaseSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature: input.depth === "free" ? 0.8 : 0.7,
      maxOutputTokens: 2800,
      requireJsonResponse: true,
    });

    const idea = parseIdeaFromResponse(response.text);
    const estimatedCostUsd =
      response.usage.estimatedCostUsd ?? estimateCostUsd(response.usage, modelConfig);

    await createAiUsageLog({
      workspaceId: input.workspace.id,
      operationType,
      provider: response.provider,
      model: response.model,
      status: "SUCCESS",
      promptTokens: response.usage.promptTokens ?? null,
      completionTokens: response.usage.completionTokens ?? null,
      totalTokens: response.usage.totalTokens ?? null,
      estimatedCostUsd,
      providerRequestId: response.usage.providerRequestId ?? null,
      agentName: "finalEditor",
    });

    return {
      idea,
      usage: {
        ...response.usage,
        estimatedCostUsd,
      },
      provider: response.provider,
      model: response.model,
      rawText: response.text,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown AI generation failure.";

    await createAiUsageLog({
      workspaceId: input.workspace.id,
      operationType,
      provider: modelConfig.provider,
      model: modelConfig.model,
      status: "FAILED",
      errorMessage,
      agentName: "finalEditor",
    });

    throw error;
  }
}

export async function refineIdea(input: RefineIdeaInput) {
  return runSingleIdeaOperation(
    AiOperationType.REFINE_IDEA,
    buildRefineIdeaPrompt(input),
    input,
  );
}

export async function generateMvpConcept(input: GenerateMvpConceptInput) {
  return runSingleIdeaOperation(
    AiOperationType.MVP_CONCEPT,
    buildMvpConceptPrompt(input),
    input,
  );
}

export async function realityCheck(input: RealityCheckInput) {
  return runSingleIdeaOperation(
    AiOperationType.REALITY_CHECK,
    buildRealityCheckPrompt(input),
    input,
  );
}
