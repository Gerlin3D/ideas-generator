import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { GenerateIdeasForm } from "@/app/generate/form";

export default async function GeneratePage() {
  await requireWorkspaceSession();

  return (
    <AppShell
      title="Generate Ideas"
      description="Generate workspace-specific business ideas using the AI layer, then store every result with version history and usage tracking."
    >
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
            generate
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Run structured idea generation
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Choose how many ideas to generate, which market to target, and how
            deep the model should go. The response is requested as JSON only and
            saved automatically into the current workspace.
          </p>

          <div className="mt-8">
            <GenerateIdeasForm />
          </div>
        </section>

        <div className="grid gap-6">
          <RouteCard
            eyebrow="Depth modes"
            title="Free to Deep"
            description="Free is useful for cheap experimentation, Draft is faster, Smart is the default balance, and Deep is reserved for stronger but more expensive reasoning."
          />
          <RouteCard
            eyebrow="Storage"
            title="Auto-saved outputs"
            description="Each generated result becomes a persisted Idea plus an INITIAL IdeaVersion, so you can refine later without overwriting the original concept."
          />
        </div>
      </div>
    </AppShell>
  );
}
