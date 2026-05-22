import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildCriticPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Critic",
    [
      "weak points",
      "market risks",
      "competition",
      "reasons the idea may fail",
    ],
    input,
  );
}
