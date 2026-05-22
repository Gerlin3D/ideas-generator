import { prisma } from "@/lib/prisma";
import type { AiLogInput, AiModelConfig, ProviderUsage } from "@/lib/ai/types";

export function estimateCostUsd(
  usage: ProviderUsage,
  modelConfig: AiModelConfig,
): number | null {
  const promptTokens = usage.promptTokens ?? 0;
  const completionTokens = usage.completionTokens ?? 0;

  if (
    modelConfig.inputPricePer1M === undefined ||
    modelConfig.outputPricePer1M === undefined
  ) {
    return null;
  }

  return (
    (promptTokens / 1_000_000) * modelConfig.inputPricePer1M +
    (completionTokens / 1_000_000) * modelConfig.outputPricePer1M
  );
}

export async function createAiUsageLog(input: AiLogInput) {
  return prisma.aiUsageLog.create({
    data: {
      workspaceId: input.workspaceId,
      ideaId: input.ideaId ?? null,
      ideaVersionId: input.ideaVersionId ?? null,
      operationType: input.operationType,
      agentName: input.agentName ?? null,
      provider: input.provider,
      model: input.model,
      promptTokens: input.promptTokens ?? null,
      completionTokens: input.completionTokens ?? null,
      totalTokens: input.totalTokens ?? null,
      estimatedCostUsd: input.estimatedCostUsd ?? null,
      providerRequestId: input.providerRequestId ?? null,
      status: input.status,
      errorMessage: input.errorMessage ?? null,
    },
  });
}

export function combineUsage(...usages: ProviderUsage[]): ProviderUsage {
  const promptTokens = usages.reduce(
    (sum, usage) => sum + (usage.promptTokens ?? 0),
    0,
  );
  const completionTokens = usages.reduce(
    (sum, usage) => sum + (usage.completionTokens ?? 0),
    0,
  );
  const totalTokens = usages.reduce(
    (sum, usage) => sum + (usage.totalTokens ?? 0),
    0,
  );
  const estimatedCostUsd = usages.reduce(
    (sum, usage) => sum + (usage.estimatedCostUsd ?? 0),
    0,
  );

  return {
    promptTokens,
    completionTokens,
    totalTokens,
    estimatedCostUsd,
    providerRequestId: null,
  };
}
