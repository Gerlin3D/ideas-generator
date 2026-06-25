import { buildBuilderReviewEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildBuilderPrompt(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  return buildBuilderReviewEnvelope(input, candidateIdeas);
}
