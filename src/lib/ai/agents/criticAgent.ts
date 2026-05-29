import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildCriticPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Critic",
    "Stress-test the idea, identify the most dangerous assumptions, and point out where demand, competition, or execution can break it.",
    [
      "weak points",
      "market risks",
      "competition",
      "reasons the idea may fail",
    ],
    input,
  );
}
