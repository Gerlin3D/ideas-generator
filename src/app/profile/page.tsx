import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { notFound } from "next/navigation";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/app/profile/form";

export default async function ProfilePage() {
  const workspaceId = await requireWorkspaceSession();

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      name: true,
      description: true,
      skills: true,
      interests: true,
      goals: true,
      constraints: true,
      preferredMarkets: true,
      preferredBusinessModels: true,
      budgetLevel: true,
      riskLevel: true,
      availableTime: true,
      additionalContext: true,
      monthlyBudgetUsd: true,
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <AppShell
      title="Workspace Profile"
      description="Configure the private generation context for this workspace so every future idea is grounded in your strengths, goals, constraints, and budget."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
          <ProfileForm
            workspaceName={workspace.name}
            initialValues={{
              description: workspace.description ?? "",
              skills: workspace.skills.join(", "),
              interests: workspace.interests.join(", "),
              goals: workspace.goals.join(", "),
              constraints: workspace.constraints.join(", "),
              preferredMarkets: workspace.preferredMarkets.join(", "),
              preferredBusinessModels:
                workspace.preferredBusinessModels.join(", "),
              budgetLevel: workspace.budgetLevel ?? "",
              riskLevel: workspace.riskLevel ?? "",
              availableTime: workspace.availableTime ?? "",
              additionalContext: workspace.additionalContext ?? "",
              monthlyBudgetUsd:
                workspace.monthlyBudgetUsd !== null &&
                workspace.monthlyBudgetUsd !== undefined
                  ? String(workspace.monthlyBudgetUsd)
                  : "",
            }}
          />
        </section>

        <div className="grid gap-6">
          <RouteCard
            eyebrow="/profile"
            title="Generation context"
            description="These fields become the private operating profile for this workspace, so future ideas can be more specific, realistic, and monetizable."
          />
          <RouteCard
            eyebrow="MVP input model"
            title="Comma-separated arrays"
            description="For the MVP, multi-value fields are edited as simple comma-separated text and converted to arrays on save."
          />
        </div>
      </div>
    </AppShell>
  );
}
