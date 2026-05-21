import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { requireWorkspaceSession } from "@/lib/auth/session";

export default async function UsagePage() {
  await requireWorkspaceSession();

  return (
    <AppShell
      title="Usage"
      description="Token and cost tracking are part of the core MVP, so the analytics route is scaffolded from day one alongside AiUsageLog."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <RouteCard eyebrow="Today" title="Daily Totals" description="Will show tokens, estimated cost, and request counts for the current workspace." />
        <RouteCard eyebrow="This Month" title="Monthly Totals" description="Will aggregate provider, model, operation type, and agent usage from AiUsageLog." />
      </div>
    </AppShell>
  );
}
