import type { Workspace } from "@/generated/prisma/client";
import type { AiOperationType } from "@/generated/prisma/enums";

export const AI_DEPTHS = ["free", "draft", "smart", "deep"] as const;
export type AiDepth = (typeof AI_DEPTHS)[number];

export const MARKET_FOCUS_VALUES = ["RU", "GLOBAL", "BOTH"] as const;
export type MarketFocus = (typeof MARKET_FOCUS_VALUES)[number];

export type IdeaScores = {
  overall: number;
  market: number;
  feasibility: number;
  monetization: number;
  personalFit: number;
};

export type GeneratedIdea = {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  targetAudience?: string;
  problem?: string;
  solution?: string;
  monetization: string[];
  mvpFeatures: string[];
  risks: string[];
  firstSteps: string[];
  scores: IdeaScores;
};

export type WorkspaceContext = Pick<
  Workspace,
  | "id"
  | "name"
  | "description"
  | "skills"
  | "interests"
  | "goals"
  | "constraints"
  | "preferredMarkets"
  | "preferredBusinessModels"
  | "budgetLevel"
  | "riskLevel"
  | "availableTime"
  | "additionalContext"
  | "monthlyBudgetUsd"
>;

export type GenerateIdeasInput = {
  workspace: WorkspaceContext;
  numberOfIdeas: number;
  category?: string;
  marketFocus: MarketFocus;
  depth: AiDepth;
  customPrompt?: string;
};

export type IdeaContext = {
  title: string;
  shortDescription: string;
  fullDescription?: string | null;
  category?: string | null;
  targetAudience?: string | null;
  problem?: string | null;
  solution?: string | null;
  monetization: string[];
  mvpFeatures: string[];
  risks: string[];
  firstSteps: string[];
  scores: IdeaScores;
};

export type RefineIdeaInput = {
  workspace: WorkspaceContext;
  idea: IdeaContext;
  depth: AiDepth;
  customPrompt?: string;
};

export type GenerateMvpConceptInput = {
  workspace: WorkspaceContext;
  idea: IdeaContext;
  depth: AiDepth;
  customPrompt?: string;
};

export type RealityCheckInput = {
  workspace: WorkspaceContext;
  idea: IdeaContext;
  depth: AiDepth;
  customPrompt?: string;
};

export type AiModelConfig = {
  provider: "openrouter";
  model: string;
  inputPricePer1M?: number;
  outputPricePer1M?: number;
};

export const AGENT_NAMES = [
  "dreamer",
  "builder",
  "investor",
  "critic",
  "finalEditor",
] as const;

export type AgentName = (typeof AGENT_NAMES)[number];

export const AI_MODELS: Record<AiDepth, AiModelConfig> = {
  free: {
    provider: "openrouter",
    model: "openrouter/free",
    inputPricePer1M: 0,
    outputPricePer1M: 0,
  },
  draft: {
    provider: "openrouter",
    model: "openai/gpt-4.1-mini",
    inputPricePer1M: 0.4,
    outputPricePer1M: 1.6,
  },
  smart: {
    provider: "openrouter",
    model: "openai/gpt-4.1",
    inputPricePer1M: 2,
    outputPricePer1M: 8,
  },
  deep: {
    provider: "openrouter",
    model: "anthropic/claude-3.7-sonnet",
    inputPricePer1M: 3,
    outputPricePer1M: 15,
  },
};

export type ProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ProviderUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number | null;
  providerRequestId?: string | null;
};

export type ProviderTextResponse = {
  provider: string;
  model: string;
  text: string;
  usage: ProviderUsage;
};

export type RunTextGenerationInput = {
  modelConfig: AiModelConfig;
  messages: ProviderMessage[];
  temperature?: number;
  maxOutputTokens?: number;
  requireJsonResponse?: boolean;
};

export type AiLogInput = {
  workspaceId: string;
  operationType: AiOperationType;
  provider: string;
  model: string;
  status: "SUCCESS" | "FAILED";
  agentName?: string | null;
  ideaId?: string | null;
  ideaVersionId?: string | null;
  promptTokens?: number | null;
  completionTokens?: number | null;
  totalTokens?: number | null;
  estimatedCostUsd?: number | null;
  providerRequestId?: string | null;
  errorMessage?: string | null;
};

export type GenerateIdeasResult = {
  ideas: GeneratedIdea[];
  usage: ProviderUsage;
  provider: string;
  model: string;
  rawText: string;
};

export type AgentRunResult = {
  agentName: AgentName;
  text: string;
  provider: string;
  model: string;
  usage: ProviderUsage;
};
