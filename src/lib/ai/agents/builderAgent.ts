import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildBuilderPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Builder",
    "Judge whether the idea can be shipped, tested, or manually delivered quickly with realistic scope and low operational drag.",
    [
      "technical feasibility",
      "MVP scope",
      "how fast the user can build it",
      "simplifying execution risk",
    ],
    input,
  );
}
