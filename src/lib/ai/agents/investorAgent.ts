import { buildInvestorReviewEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildInvestorPrompt(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  return buildInvestorReviewEnvelope(input, candidateIdeas);
}
