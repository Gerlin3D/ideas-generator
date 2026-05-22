import { AppShell } from "@/components/app-shell";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { formatEnumLabel } from "@/lib/ideas";
import { getWorkspaceUsageStats } from "@/lib/usage-stats";

export default async function UsagePage() {
  const workspaceId = await requireWorkspaceSession();
  const usage = await getWorkspaceUsageStats(workspaceId);

  function StatCard({
    eyebrow,
    title,
    value,
    secondary,
  }: {
    eyebrow: string;
    title: string;
    value: string;
    secondary: string;
  }) {
    return (
      <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">{eyebrow}</p>
        <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-2 text-sm text-slate-400">{secondary}</p>
      </section>
    );
  }

  return (
    <AppShell
      title="Usage"
      description="Track AI requests, token usage, estimated cost, and which operations or agents are consuming the current workspace budget."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <StatCard
              eyebrow="Today"
              title="Requests"
              value={String(usage.today.requests)}
              secondary={`${usage.today.tokens.toLocaleString()} tokens`}
            />
            <StatCard
              eyebrow="Today"
              title="Estimated cost"
              value={`$${usage.today.cost.toFixed(4)}`}
              secondary="Successful requests only"
            />
            <StatCard
              eyebrow="This month"
              title="Requests"
              value={String(usage.month.requests)}
              secondary={`${usage.month.tokens.toLocaleString()} tokens`}
            />
            <StatCard
              eyebrow="This month"
              title="Estimated cost"
              value={`$${usage.month.cost.toFixed(4)}`}
              secondary="Successful requests only"
            />
          </div>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Requests by operation</h2>
            <div className="mt-4 grid gap-3">
              {usage.byOperation.length === 0 ? (
                <p className="text-sm text-slate-400">No usage data yet.</p>
              ) : (
                usage.byOperation.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                  >
                    <span>{formatEnumLabel(item.label)}</span>
                    <span>
                      {item.requests} requests · {item.tokens.toLocaleString()} tokens · $
                      {item.cost.toFixed(4)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Usage by agent</h2>
            <div className="mt-4 grid gap-3">
              {usage.byAgent.length === 0 ? (
                <p className="text-sm text-slate-400">No agent usage data yet.</p>
              ) : (
                usage.byAgent.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                  >
                    <span>{item.label}</span>
                    <span>
                      {item.requests} requests · {item.tokens.toLocaleString()} tokens · $
                      {item.cost.toFixed(4)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6">
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Usage by model</h2>
            <div className="mt-4 grid gap-3">
              {usage.byModel.length === 0 ? (
                <p className="text-sm text-slate-400">No model usage data yet.</p>
              ) : (
                usage.byModel.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                  >
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="mt-2">
                      {item.requests} requests · {item.tokens.toLocaleString()} tokens · $
                      {item.cost.toFixed(4)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Recent failures</h2>
            <div className="mt-4 grid gap-3">
              {usage.recentFailures.length === 0 ? (
                <p className="text-sm text-slate-400">No recent failures.</p>
              ) : (
                usage.recentFailures.map((item, index) => (
                  <div
                    key={`${item.createdAt.toISOString()}-${index}`}
                    className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
                  >
                    <p className="font-medium">
                      {formatEnumLabel(item.operationType)} · {item.provider} / {item.model}
                    </p>
                    <p className="mt-2 text-rose-200/90">
                      Failed at {item.createdAt.toLocaleString("en-US")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
