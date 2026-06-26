import { AiRequestStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

async function getUsageTotals(
  workspaceId: string,
  createdAt?: {
    gte: Date;
  },
) {
  const result = await prisma.aiUsageLog.aggregate({
    where: {
      workspaceId,
      status: AiRequestStatus.SUCCESS,
      ...(createdAt ? { createdAt } : {}),
    },
    _count: {
      _all: true,
    },
    _sum: {
      totalTokens: true,
      estimatedCostUsd: true,
    },
  });

  return {
    requests: result._count._all,
    tokens: result._sum.totalTokens ?? 0,
    cost: result._sum.estimatedCostUsd ?? 0,
  };
}

async function getUsageByOperation(workspaceId: string, monthStart: Date) {
  const rows = await prisma.aiUsageLog.groupBy({
    by: ["operationType"],
    where: {
      workspaceId,
      status: AiRequestStatus.SUCCESS,
      createdAt: {
        gte: monthStart,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      totalTokens: true,
      estimatedCostUsd: true,
    },
  });

  return rows
    .map((row) => ({
      label: row.operationType,
      requests: row._count._all,
      tokens: row._sum.totalTokens ?? 0,
      cost: row._sum.estimatedCostUsd ?? 0,
    }))
    .sort((a, b) => b.requests - a.requests);
}

async function getUsageByAgent(workspaceId: string, monthStart: Date) {
  const rows = await prisma.aiUsageLog.groupBy({
    by: ["agentName"],
    where: {
      workspaceId,
      status: AiRequestStatus.SUCCESS,
      createdAt: {
        gte: monthStart,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      totalTokens: true,
      estimatedCostUsd: true,
    },
  });

  return rows
    .map((row) => ({
      label: row.agentName ?? "unknown",
      requests: row._count._all,
      tokens: row._sum.totalTokens ?? 0,
      cost: row._sum.estimatedCostUsd ?? 0,
    }))
    .sort((a, b) => b.requests - a.requests);
}

async function getUsageByModel(workspaceId: string, monthStart: Date) {
  const rows = await prisma.aiUsageLog.groupBy({
    by: ["provider", "model"],
    where: {
      workspaceId,
      status: AiRequestStatus.SUCCESS,
      createdAt: {
        gte: monthStart,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      totalTokens: true,
      estimatedCostUsd: true,
    },
  });

  return rows
    .map((row) => ({
      label: `${row.provider} / ${row.model}`,
      requests: row._count._all,
      tokens: row._sum.totalTokens ?? 0,
      cost: row._sum.estimatedCostUsd ?? 0,
    }))
    .sort((a, b) => b.requests - a.requests);
}

async function getRecentFailures(workspaceId: string) {
  return prisma.aiUsageLog.findMany({
    where: {
      workspaceId,
      status: AiRequestStatus.FAILED,
    },
    select: {
      operationType: true,
      agentName: true,
      provider: true,
      model: true,
      totalTokens: true,
      estimatedCostUsd: true,
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export async function getWorkspaceUsageStats(workspaceId: string) {
  const now = new Date();
  const dayStart = startOfDay(now);
  const monthStart = startOfMonth(now);
  const [
    todayTotals,
    monthTotals,
    byOperation,
    byAgent,
    byModel,
    recentFailures,
  ] = await Promise.all([
    getUsageTotals(workspaceId, { gte: dayStart }),
    getUsageTotals(workspaceId, { gte: monthStart }),
    getUsageByOperation(workspaceId, monthStart),
    getUsageByAgent(workspaceId, monthStart),
    getUsageByModel(workspaceId, monthStart),
    getRecentFailures(workspaceId),
  ]);

  return {
    today: todayTotals,
    month: monthTotals,
    byOperation,
    byAgent,
    byModel,
    recentFailures,
  };
}

export async function getIdeaUsageStats(workspaceId: string, ideaId: string) {
  const logs = await prisma.aiUsageLog.findMany({
    where: {
      workspaceId,
      ideaId,
    },
    select: {
      id: true,
      operationType: true,
      agentName: true,
      provider: true,
      model: true,
      promptTokens: true,
      completionTokens: true,
      totalTokens: true,
      estimatedCostUsd: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    logs,
    totals: {
      requests: logs.length,
      tokens: logs.reduce((sum, log) => sum + (log.totalTokens ?? 0), 0),
      cost: logs.reduce((sum, log) => sum + (log.estimatedCostUsd ?? 0), 0),
    },
  };
}
