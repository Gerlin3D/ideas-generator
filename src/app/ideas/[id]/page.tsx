import { AppShell } from "@/components/app-shell";
import { IdeaStatusBadge } from "@/components/idea-status-badge";
import { IdeaVersionBadge } from "@/components/idea-version-badge";
import { IdeaActions } from "@/app/ideas/[id]/idea-actions";
import { formatDate, formatEnumLabel, getCurrentIdeaVersion } from "@/lib/ideas";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getIdeaUsageStats } from "@/lib/usage-stats";
import { notFound } from "next/navigation";

type IdeaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const workspaceId = await requireWorkspaceSession();
  const { id } = await params;

  const idea = await prisma.idea.findFirst({
    where: {
      id,
      workspaceId,
    },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      category: true,
      status: true,
      currentVersionId: true,
      createdAt: true,
      updatedAt: true,
      currentVersion: {
        select: {
          id: true,
          versionNumber: true,
          type: true,
          title: true,
          shortDescription: true,
          fullDescription: true,
          category: true,
          targetAudience: true,
          problem: true,
          solution: true,
          monetization: true,
          mvpFeatures: true,
          risks: true,
          firstSteps: true,
          overallScore: true,
          marketScore: true,
          feasibilityScore: true,
          monetizationScore: true,
          personalFitScore: true,
          createdAt: true,
        },
      },
      versions: {
        orderBy: [{ versionNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          versionNumber: true,
          type: true,
          title: true,
          shortDescription: true,
          fullDescription: true,
          category: true,
          targetAudience: true,
          problem: true,
          solution: true,
          monetization: true,
          mvpFeatures: true,
          risks: true,
          firstSteps: true,
          overallScore: true,
          marketScore: true,
          feasibilityScore: true,
          monetizationScore: true,
          personalFitScore: true,
          createdAt: true,
        },
      },
    },
  });

  if (!idea) {
    notFound();
  }

  const ideaUsage = await getIdeaUsageStats(workspaceId, idea.id);
  const currentVersion = getCurrentIdeaVersion(idea);

  function DetailList({
    title,
    items,
  }: {
    title: string;
    items: string[] | undefined;
  }) {
    if (!items || items.length === 0) {
      return null;
    }

    return (
      <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
          {items.map((item) => (
            <li key={item} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <AppShell
      title={currentVersion?.title ?? idea.title}
      description="Idea detail preserves the current working version and the complete version history, so later refinement can add depth without overwriting the original."
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6">
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <IdeaStatusBadge status={idea.status} />
                  {currentVersion ? (
                    <IdeaVersionBadge type={currentVersion.type} />
                  ) : null}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
                    /ideas/{idea.id}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    {currentVersion?.title ?? idea.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    {currentVersion?.shortDescription ?? idea.shortDescription}
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                <p>Created: {formatDate(idea.createdAt)}</p>
                <p className="mt-2">Updated: {formatDate(idea.updatedAt)}</p>
                <p className="mt-2">
                  Current version:{" "}
                  {currentVersion ? `v${currentVersion.versionNumber}` : "None"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Category
                </p>
                <p className="mt-2 text-sm text-white">
                  {currentVersion?.category ?? idea.category ?? "Unspecified"}
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Target audience
                </p>
                <p className="mt-2 text-sm text-white">
                  {currentVersion?.targetAudience ?? "Not specified yet"}
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Problem
                </p>
                <p className="mt-2 text-sm text-white">
                  {currentVersion?.problem ?? "Not specified yet"}
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Solution
                </p>
                <p className="mt-2 text-sm text-white">
                  {currentVersion?.solution ?? "Not specified yet"}
                </p>
              </div>
            </div>

            {currentVersion?.fullDescription ? (
              <div className="mt-6 rounded-[20px] border border-slate-800/80 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Full description
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {currentVersion.fullDescription}
                </p>
              </div>
            ) : null}
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <DetailList title="Monetization" items={currentVersion?.monetization} />
            <DetailList title="MVP features" items={currentVersion?.mvpFeatures} />
            <DetailList title="Risks" items={currentVersion?.risks} />
            <DetailList title="First steps" items={currentVersion?.firstSteps} />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Scores</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              {[
                ["Overall", currentVersion?.overallScore],
                ["Market", currentVersion?.marketScore],
                ["Feasibility", currentVersion?.feasibilityScore],
                ["Monetization", currentVersion?.monetizationScore],
                ["Personal fit", currentVersion?.personalFitScore],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3"
                >
                  <span>{label}</span>
                  <span className="font-medium text-white">
                    {value !== null && value !== undefined ? value : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Version history</h2>
            <div className="mt-4 grid gap-3">
              {idea.versions.length === 0 ? (
                <p className="text-sm text-slate-400">No versions saved yet.</p>
              ) : (
                idea.versions.map((version: (typeof idea.versions)[number]) => (
                  <div
                    key={version.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          v{version.versionNumber}
                        </span>
                        <IdeaVersionBadge type={version.type} />
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatDate(version.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-white">
                      {version.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {version.shortDescription}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Current state</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                Status: {formatEnumLabel(idea.status)}
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                Stored versions: {idea.versions.length}
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <h2 className="text-lg font-semibold text-white">AI usage</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                Requests: {ideaUsage.totals.requests}
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                Tokens: {ideaUsage.totals.tokens.toLocaleString()}
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                Estimated cost: ${ideaUsage.totals.cost.toFixed(4)}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {ideaUsage.logs.length === 0 ? (
                <p className="text-sm text-slate-400">No usage logs for this idea yet.</p>
              ) : (
                ideaUsage.logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                  >
                    <p className="font-medium text-white">
                      {formatEnumLabel(log.operationType)} · {log.agentName ?? "agent"} · {log.provider} / {log.model}
                    </p>
                    <p className="mt-2">
                      {log.totalTokens ?? 0} tokens · ${(
                        log.estimatedCostUsd ?? 0
                      ).toFixed(4)} · {log.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <IdeaActions ideaId={idea.id} />
        </div>
      </div>
    </AppShell>
  );
}
