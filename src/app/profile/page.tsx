import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";

export default function ProfilePage() {
  return (
    <AppShell
      title="Workspace Profile"
      description="This route is reserved for the generation context that will shape every AI request: skills, goals, constraints, markets, budget, and more."
    >
      <RouteCard
        eyebrow="/profile"
        title="Generation Settings"
        description="The schema already supports array-style fields with PostgreSQL arrays, so the upcoming form can save comma-separated values cleanly."
      />
    </AppShell>
  );
}
