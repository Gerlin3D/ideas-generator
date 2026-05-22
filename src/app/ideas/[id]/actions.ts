"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IdeaVersionType } from "@/generated/prisma/enums";
import {
  generateMvpConcept,
  realityCheck,
  refineIdea,
} from "@/lib/ai/orchestrator";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getFormDataStrings } from "@/lib/validation/forms";

export type IdeaActionState = {
  error: string | null;
};

async function loadIdeaForWorkspace(workspaceId: string, ideaId: string) {
  return prisma.idea.findFirst({
    where: {
      id: ideaId,
      workspaceId,
    },
    select: {
      id: true,
      currentVersionId: true,
      currentVersion: {
        select: {
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
        },
      },
      versions: {
        orderBy: [{ versionNumber: "desc" }],
        take: 1,
        select: {
          versionNumber: true,
        },
      },
    },
  });
}

async function loadWorkspaceContext(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      id: true,
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
}

async function persistIdeaVersion(
  ideaId: string,
  currentVersionNumber: number,
  idea: Awaited<ReturnType<typeof refineIdea>>["idea"],
  type:
    | typeof IdeaVersionType.REFINED
    | typeof IdeaVersionType.MVP_CONCEPT
    | typeof IdeaVersionType.REALITY_CHECK,
) {
  return prisma.$transaction(async (tx) => {
    const createdVersion = await tx.ideaVersion.create({
      data: {
        ideaId,
        versionNumber: currentVersionNumber + 1,
        type,
        title: idea.title,
        shortDescription: idea.shortDescription,
        fullDescription: idea.fullDescription,
        category: idea.category,
        targetAudience: idea.targetAudience,
        problem: idea.problem,
        solution: idea.solution,
        monetization: idea.monetization,
        mvpFeatures: idea.mvpFeatures,
        risks: idea.risks,
        firstSteps: idea.firstSteps,
        overallScore: idea.scores.overall,
        marketScore: idea.scores.market,
        feasibilityScore: idea.scores.feasibility,
        monetizationScore: idea.scores.monetization,
        personalFitScore: idea.scores.personalFit,
        rawAiResponse: idea,
      },
      select: {
        id: true,
      },
    });

    await tx.idea.update({
      where: {
        id: ideaId,
      },
      data: {
        title: idea.title,
        shortDescription: idea.shortDescription,
        category: idea.category,
        currentVersionId: createdVersion.id,
      },
    });
  });
}

export async function refineIdeaAction(
  _prevState: IdeaActionState,
  formData: FormData,
): Promise<IdeaActionState> {
  try {
    const workspaceId = await requireWorkspaceSession();
    const values = getFormDataStrings(formData, [
      "ideaId",
      "depth",
      "customPrompt",
    ] as const);

    const workspace = await loadWorkspaceContext(workspaceId);
    const ideaRecord = await loadIdeaForWorkspace(workspaceId, values.ideaId);

    if (!workspace || !ideaRecord || !ideaRecord.currentVersion) {
      return { error: "Idea or workspace context was not found." };
    }

    const result = await refineIdea({
      workspace,
      depth: values.depth as "free" | "draft" | "smart" | "deep",
      customPrompt: values.customPrompt.trim() || undefined,
      idea: {
        title: ideaRecord.currentVersion.title,
        shortDescription: ideaRecord.currentVersion.shortDescription,
        fullDescription: ideaRecord.currentVersion.fullDescription,
        category: ideaRecord.currentVersion.category,
        targetAudience: ideaRecord.currentVersion.targetAudience,
        problem: ideaRecord.currentVersion.problem,
        solution: ideaRecord.currentVersion.solution,
        monetization: ideaRecord.currentVersion.monetization,
        mvpFeatures: ideaRecord.currentVersion.mvpFeatures,
        risks: ideaRecord.currentVersion.risks,
        firstSteps: ideaRecord.currentVersion.firstSteps,
        scores: {
          overall: ideaRecord.currentVersion.overallScore ?? 0,
          market: ideaRecord.currentVersion.marketScore ?? 0,
          feasibility: ideaRecord.currentVersion.feasibilityScore ?? 0,
          monetization: ideaRecord.currentVersion.monetizationScore ?? 0,
          personalFit: ideaRecord.currentVersion.personalFitScore ?? 0,
        },
      },
    });

    await persistIdeaVersion(
      ideaRecord.id,
      ideaRecord.versions[0]?.versionNumber ?? 1,
      result.idea,
      IdeaVersionType.REFINED,
    );

    revalidatePath(`/ideas/${ideaRecord.id}`);
    revalidatePath("/ideas");
  } catch (error) {
    console.error("refineIdeaAction failed", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to refine the idea right now. Check the server log and try again.",
    };
  }

  redirect(`/ideas/${formData.get("ideaId")}`);
}

export async function generateMvpConceptAction(
  _prevState: IdeaActionState,
  formData: FormData,
): Promise<IdeaActionState> {
  try {
    const workspaceId = await requireWorkspaceSession();
    const values = getFormDataStrings(formData, [
      "ideaId",
      "depth",
      "customPrompt",
    ] as const);

    const workspace = await loadWorkspaceContext(workspaceId);
    const ideaRecord = await loadIdeaForWorkspace(workspaceId, values.ideaId);

    if (!workspace || !ideaRecord || !ideaRecord.currentVersion) {
      return { error: "Idea or workspace context was not found." };
    }

    const result = await generateMvpConcept({
      workspace,
      depth: values.depth as "free" | "draft" | "smart" | "deep",
      customPrompt: values.customPrompt.trim() || undefined,
      idea: {
        title: ideaRecord.currentVersion.title,
        shortDescription: ideaRecord.currentVersion.shortDescription,
        fullDescription: ideaRecord.currentVersion.fullDescription,
        category: ideaRecord.currentVersion.category,
        targetAudience: ideaRecord.currentVersion.targetAudience,
        problem: ideaRecord.currentVersion.problem,
        solution: ideaRecord.currentVersion.solution,
        monetization: ideaRecord.currentVersion.monetization,
        mvpFeatures: ideaRecord.currentVersion.mvpFeatures,
        risks: ideaRecord.currentVersion.risks,
        firstSteps: ideaRecord.currentVersion.firstSteps,
        scores: {
          overall: ideaRecord.currentVersion.overallScore ?? 0,
          market: ideaRecord.currentVersion.marketScore ?? 0,
          feasibility: ideaRecord.currentVersion.feasibilityScore ?? 0,
          monetization: ideaRecord.currentVersion.monetizationScore ?? 0,
          personalFit: ideaRecord.currentVersion.personalFitScore ?? 0,
        },
      },
    });

    await persistIdeaVersion(
      ideaRecord.id,
      ideaRecord.versions[0]?.versionNumber ?? 1,
      result.idea,
      IdeaVersionType.MVP_CONCEPT,
    );

    revalidatePath(`/ideas/${ideaRecord.id}`);
    revalidatePath("/ideas");
  } catch (error) {
    console.error("generateMvpConceptAction failed", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to generate the MVP concept right now. Check the server log and try again.",
    };
  }

  redirect(`/ideas/${formData.get("ideaId")}`);
}

export async function realityCheckAction(
  _prevState: IdeaActionState,
  formData: FormData,
): Promise<IdeaActionState> {
  try {
    const workspaceId = await requireWorkspaceSession();
    const values = getFormDataStrings(formData, [
      "ideaId",
      "depth",
      "customPrompt",
    ] as const);

    const workspace = await loadWorkspaceContext(workspaceId);
    const ideaRecord = await loadIdeaForWorkspace(workspaceId, values.ideaId);

    if (!workspace || !ideaRecord || !ideaRecord.currentVersion) {
      return { error: "Idea or workspace context was not found." };
    }

    const result = await realityCheck({
      workspace,
      depth: values.depth as "free" | "draft" | "smart" | "deep",
      customPrompt: values.customPrompt.trim() || undefined,
      idea: {
        title: ideaRecord.currentVersion.title,
        shortDescription: ideaRecord.currentVersion.shortDescription,
        fullDescription: ideaRecord.currentVersion.fullDescription,
        category: ideaRecord.currentVersion.category,
        targetAudience: ideaRecord.currentVersion.targetAudience,
        problem: ideaRecord.currentVersion.problem,
        solution: ideaRecord.currentVersion.solution,
        monetization: ideaRecord.currentVersion.monetization,
        mvpFeatures: ideaRecord.currentVersion.mvpFeatures,
        risks: ideaRecord.currentVersion.risks,
        firstSteps: ideaRecord.currentVersion.firstSteps,
        scores: {
          overall: ideaRecord.currentVersion.overallScore ?? 0,
          market: ideaRecord.currentVersion.marketScore ?? 0,
          feasibility: ideaRecord.currentVersion.feasibilityScore ?? 0,
          monetization: ideaRecord.currentVersion.monetizationScore ?? 0,
          personalFit: ideaRecord.currentVersion.personalFitScore ?? 0,
        },
      },
    });

    await persistIdeaVersion(
      ideaRecord.id,
      ideaRecord.versions[0]?.versionNumber ?? 1,
      result.idea,
      IdeaVersionType.REALITY_CHECK,
    );

    revalidatePath(`/ideas/${ideaRecord.id}`);
    revalidatePath("/ideas");
  } catch (error) {
    console.error("realityCheckAction failed", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to run reality check right now. Check the server log and try again.",
    };
  }

  redirect(`/ideas/${formData.get("ideaId")}`);
}
