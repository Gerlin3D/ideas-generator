import { buildCriticReviewEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildCriticPrompt(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  return buildCriticReviewEnvelope(input, candidateIdeas);
}
