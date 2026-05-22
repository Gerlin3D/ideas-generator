import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildInvestorPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Investor",
    [
      "monetization path",
      "pricing logic",
      "first customers",
      "realistic earning potential",
    ],
    input,
  );
}
