import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";

export default function IdeasPage() {
  return (
    <AppShell
      title="Ideas"
      description="Ideas will be stored per workspace and versioned instead of overwritten, matching the product rules from the master prompt."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <RouteCard eyebrow="/ideas" title="Workspace-Scoped List" description="This list will later query only the current workspace's ideas using workspaceId filters." />
        <RouteCard eyebrow="Versioning" title="History Preserved" description="IdeaVersion is already modeled for INITIAL, REFINED, MVP_CONCEPT, REALITY_CHECK, and ROADMAP flows." />
      </div>
    </AppShell>
  );
}
