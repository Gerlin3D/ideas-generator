import { buildDreamerCandidateEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildDreamerPrompt(input: GenerateIdeasInput) {
  return buildDreamerCandidateEnvelope(input);
}
