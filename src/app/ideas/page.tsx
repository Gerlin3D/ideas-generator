import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DeleteIdeaButton } from "@/components/delete-idea-button";
import { IdeaStatusBadge } from "@/components/idea-status-badge";
import { IdeaVersionBadge } from "@/components/idea-version-badge";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatDate, getCurrentIdeaVersion } from "@/lib/ideas";

const IDEAS_PAGE_SIZE = 12;

type IdeasPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

function parsePageParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(rawValue ?? "1", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getIdeasPageHref(page: number) {
  return page <= 1 ? "/ideas" : `/ideas?page=${page}`;
}

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
  const workspaceId = await requireWorkspaceSession();
  const resolvedSearchParams = await searchParams;
  const requestedPage = parsePageParam(resolvedSearchParams?.page);
  const where = {
    workspaceId,
  };
  const totalIdeas = await prisma.idea.count({
    where,
  });
  const totalPages = Math.max(1, Math.ceil(totalIdeas / IDEAS_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const ideas = await prisma.idea.findMany({
    where,
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
    skip: (currentPage - 1) * IDEAS_PAGE_SIZE,
    take: IDEAS_PAGE_SIZE,
  });

  return (
    <AppShell
      title="Ideas"
      description="Ideas are scoped to the current workspace and keep version history intact, so refinement never overwrites the original concept."
    >
      {totalIdeas === 0 ? (
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
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-slate-800/80 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
            <span>
              Showing {(currentPage - 1) * IDEAS_PAGE_SIZE + 1}-
              {Math.min(currentPage * IDEAS_PAGE_SIZE, totalIdeas)} of{" "}
              {totalIdeas} ideas
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {ideas.map((idea) => {
              const currentVersion = getCurrentIdeaVersion(idea);

              return (
                <section
                  key={idea.id}
                  className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur transition hover:border-sky-400/30"
                >
                  <Link href={`/ideas/${idea.id}`} className="block">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <IdeaStatusBadge status={idea.status} />
                          {currentVersion ? (
                            <IdeaVersionBadge type={currentVersion.type} />
                          ) : null}
                        </div>
                        <p className="text-right text-xs text-slate-400">
                          {formatDate(idea.createdAt)}
                        </p>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {currentVersion?.title ?? idea.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {currentVersion?.shortDescription ??
                            idea.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                        Category:{" "}
                        {currentVersion?.category ??
                          idea.category ??
                          "Unspecified"}
                      </span>
                      <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                        Version:{" "}
                        {currentVersion
                          ? `${currentVersion.versionNumber}/${idea.versions.length}`
                          : `N/A/${idea.versions.length}`}
                      </span>
                      <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-3 py-1">
                        Overall score:{" "}
                        {currentVersion?.overallScore !== null &&
                        currentVersion?.overallScore !== undefined
                          ? currentVersion.overallScore
                          : "Pending"}
                      </span>
                    </div>
                    <DeleteIdeaButton
                      ideaId={idea.id}
                      className="flex-shrink-0"
                      label="Delete"
                    />
                  </div>
                </section>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <nav className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-slate-800/80 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
              {currentPage > 1 ? (
                <Link
                  href={getIdeasPageHref(currentPage - 1)}
                  className="rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 transition hover:border-sky-400/30 hover:text-white"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-full border border-slate-800/60 px-4 py-2 text-slate-600">
                  Previous
                </span>
              )}

              <span>
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={getIdeasPageHref(currentPage + 1)}
                  className="rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 transition hover:border-sky-400/30 hover:text-white"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border border-slate-800/60 px-4 py-2 text-slate-600">
                  Next
                </span>
              )}
            </nav>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
