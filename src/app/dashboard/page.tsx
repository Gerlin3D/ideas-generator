import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { IdeaStatusBadge } from "@/components/idea-status-badge";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { getCurrentIdeaVersion } from "@/lib/ideas";
import { prisma } from "@/lib/prisma";
import { getWorkspaceUsageStats } from "@/lib/usage-stats";

export default async function DashboardPage() {
  const workspaceId = await requireWorkspaceSession();
  const [workspace, recentIdeas, usage] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    }),
    prisma.idea.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        shortDescription: true,
        status: true,
        currentVersionId: true,
        versions: {
          orderBy: [{ versionNumber: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            versionNumber: true,
            title: true,
            shortDescription: true,
            type: true,
            category: true,
            createdAt: true,
          },
        },
      },
    }),
    getWorkspaceUsageStats(workspaceId),
  ]);

  return (
    <AppShell
      title="Dashboard"
      description={`Workspace ${workspace?.name ?? "Dashboard"} at a glance: recent ideas, quick next steps, and current-month AI usage.`}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
                  Recent ideas
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  Latest workspace concepts
                </h2>
              </div>
              <Link
                href="/ideas"
                className="rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/30 hover:text-white"
              >
                View all ideas
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              {recentIdeas.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No ideas yet. Generate the first batch to start building your
                  idea library.
                </p>
              ) : (
                recentIdeas.map((idea) => {
                  const currentVersion = getCurrentIdeaVersion(idea);

                  return (
                    <Link
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition hover:border-sky-400/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-white">
                            {currentVersion?.title ?? idea.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {currentVersion?.shortDescription ?? idea.shortDescription}
                          </p>
                        </div>
                        <IdeaStatusBadge status={idea.status} />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
              Quick actions
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                { href: "/generate", label: "Generate Ideas" },
                { href: "/profile", label: "Edit Profile" },
                { href: "/usage", label: "Usage Stats" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-4 text-sm text-slate-200 transition hover:border-sky-400/30 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6">
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
              This month
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">AI usage summary</h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                Requests: <span className="font-medium text-white">{usage.month.requests}</span>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                Tokens: <span className="font-medium text-white">{usage.month.tokens.toLocaleString()}</span>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                Estimated cost: <span className="font-medium text-white">${usage.month.cost.toFixed(4)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
              Top operations
            </p>
            <div className="mt-5 grid gap-3">
              {usage.byOperation.slice(0, 4).map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                >
                  {item.label} · {item.requests} requests
                </div>
              ))}
              {usage.byOperation.length === 0 ? (
                <p className="text-sm text-slate-400">No usage data yet.</p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
