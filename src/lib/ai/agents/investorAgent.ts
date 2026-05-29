import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildInvestorPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Investor",
    "Evaluate whether the idea has a credible path to revenue, early customers, and attractive unit economics.",
    [
      "monetization path",
      "pricing logic",
      "first customers",
      "realistic earning potential",
    ],
    input,
  );
}
