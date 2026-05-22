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

type UsageLogRecord = {
  operationType: string;
  agentName: string | null;
  provider: string;
  model: string;
  totalTokens: number | null;
  estimatedCostUsd: number | null;
  createdAt: Date;
  status: string;
};

function sumTokens(records: UsageLogRecord[]) {
  return records.reduce((sum, record) => sum + (record.totalTokens ?? 0), 0);
}

function sumCost(records: UsageLogRecord[]) {
  return records.reduce((sum, record) => sum + (record.estimatedCostUsd ?? 0), 0);
}

function groupByLabel<T extends string>(
  records: UsageLogRecord[],
  getLabel: (record: UsageLogRecord) => T,
) {
  const map = new Map<T, { label: T; requests: number; tokens: number; cost: number }>();

  for (const record of records) {
    const label = getLabel(record);
    const current = map.get(label) ?? {
      label,
      requests: 0,
      tokens: 0,
      cost: 0,
    };

    current.requests += 1;
    current.tokens += record.totalTokens ?? 0;
    current.cost += record.estimatedCostUsd ?? 0;

    map.set(label, current);
  }

  return [...map.values()].sort((a, b) => b.requests - a.requests);
}

export async function getWorkspaceUsageStats(workspaceId: string) {
  const now = new Date();
  const dayStart = startOfDay(now);
  const monthStart = startOfMonth(now);

  const logs = await prisma.aiUsageLog.findMany({
    where: {
      workspaceId,
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
  });

  const successfulLogs: UsageLogRecord[] = logs.filter(
    (log) => log.status === AiRequestStatus.SUCCESS,
  );

  const todayLogs = successfulLogs.filter((log) => log.createdAt >= dayStart);
  const monthLogs = successfulLogs.filter((log) => log.createdAt >= monthStart);

  return {
    today: {
      requests: todayLogs.length,
      tokens: sumTokens(todayLogs),
      cost: sumCost(todayLogs),
    },
    month: {
      requests: monthLogs.length,
      tokens: sumTokens(monthLogs),
      cost: sumCost(monthLogs),
    },
    byOperation: groupByLabel(monthLogs, (log) => log.operationType),
    byAgent: groupByLabel(monthLogs, (log) => log.agentName ?? "unknown"),
    byModel: groupByLabel(monthLogs, (log) => `${log.provider} / ${log.model}`),
    recentFailures: logs
      .filter((log) => log.status === AiRequestStatus.FAILED)
      .slice(0, 5),
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
