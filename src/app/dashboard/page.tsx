import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { requireWorkspaceSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  await requireWorkspaceSession();

  return (
    <AppShell
      title="Dashboard"
      description="Protected pages are scaffolded now so the upcoming auth middleware and workspace session checks have a concrete route map to protect."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <RouteCard eyebrow="Ideas" title="Recent Ideas" description="Will show the current workspace's latest concepts and their status." />
        <RouteCard eyebrow="Usage" title="Monthly Usage" description="Will summarize requests, tokens, and estimated cost from AiUsageLog." />
        <RouteCard eyebrow="Profile" title="Workspace Context" description="Will surface the settings that personalize all generation prompts." />
        <RouteCard eyebrow="Quick Actions" title="Generate Faster" description="Entry points for idea generation, review, refinement, and validation." />
      </div>
    </AppShell>
  );
}
