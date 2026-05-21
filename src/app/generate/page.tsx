import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { requireWorkspaceSession } from "@/lib/auth/session";

export default async function GeneratePage() {
  await requireWorkspaceSession();

  return (
    <AppShell
      title="Generate Ideas"
      description="This will become the orchestration entry point for Draft, Smart, and Deep generation modes once the AI provider layer is added."
    >
      <RouteCard
        eyebrow="/generate"
        title="AI Flow Placeholder"
        description="The project now has the route and schema foundations needed to store ideas, versions, and usage logs as soon as AI integration begins."
      />
    </AppShell>
  );
}
