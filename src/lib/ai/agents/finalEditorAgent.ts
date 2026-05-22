import { buildFinalEditorSynthesisPrompt } from "@/lib/ai/prompts";
import type { GenerateIdeasInput } from "@/lib/ai/types";

export function buildFinalEditorPrompt(
  input: GenerateIdeasInput,
  agentOutputs: Record<string, string>,
) {
  return buildFinalEditorSynthesisPrompt(input, agentOutputs);
}
