import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { IdeaStatusBadge } from "@/components/idea-status-badge";
import { IdeaVersionBadge } from "@/components/idea-version-badge";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatDate, getCurrentIdeaVersion } from "@/lib/ideas";

export default async function IdeasPage() {
  const workspaceId = await requireWorkspaceSession();

  const ideas = await prisma.idea.findMany({
    where: {
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
      currentVersion: {
        select: {
          id: true,
          versionNumber: true,
          title: true,
          shortDescription: true,
          type: true,
          category: true,
          overallScore: true,
          createdAt: true,
        },
      },
      versions: {
        orderBy: [{ versionNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          versionNumber: true,
          title: true,
          shortDescription: true,
          type: true,
          category: true,
          overallScore: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AppShell
      title="Ideas"
      description="Ideas are scoped to the current workspace and keep version history intact, so refinement never overwrites the original concept."
    >
      {ideas.length === 0 ? (
        <section className="rounded-[24px] border border-dashed border-slate-700/80 bg-card/70 p-8 text-center shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
            /ideas
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            No saved ideas yet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This page is ready for stored ideas from the current workspace. Once
            ideas are inserted manually or through the future AI generation flow,
            they will appear here with status, score, and version history.
          </p>
          <Link
            href="/profile"
            className="mt-6 inline-flex rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/30 hover:text-white"
          >
            Review workspace profile
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {ideas.map((idea) => {
            const currentVersion = getCurrentIdeaVersion(idea);

            return (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur transition hover:border-sky-400/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <IdeaStatusBadge status={idea.status} />
                      {currentVersion ? (
                        <IdeaVersionBadge type={currentVersion.type} />
                      ) : null}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {currentVersion?.title ?? idea.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {currentVersion?.shortDescription ?? idea.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <p>{formatDate(idea.createdAt)}</p>
                    <p className="mt-1">
                      {idea.versions.length} version
                      {idea.versions.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                    Category: {currentVersion?.category ?? idea.category ?? "Unspecified"}
                  </span>
                  <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                    Version: {currentVersion ? currentVersion.versionNumber : "N/A"}
                  </span>
                  <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                    Overall score:{" "}
                    {currentVersion?.overallScore !== null &&
                    currentVersion?.overallScore !== undefined
                      ? currentVersion.overallScore
                      : "Pending"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
