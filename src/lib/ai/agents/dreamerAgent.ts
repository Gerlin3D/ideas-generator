import { buildAgentAnalysisEnvelope } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildDreamerPrompt(input: GenerateIdeasInput) {
  return buildAgentAnalysisEnvelope(
    "Dreamer",
    "Find promising directions, unusual combinations, and high-upside niches that still feel commercially plausible.",
    [
      "opportunities",
      "niches",
      "fresh combinations",
      "creative but realistic monetization angles",
    ],
    input,
  );
}
