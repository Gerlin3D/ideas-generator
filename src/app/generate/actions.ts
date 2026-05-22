"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IdeaStatus, IdeaVersionType } from "@/generated/prisma/enums";
import { generateIdeas } from "@/lib/ai/orchestrator";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  generateIdeasSchema,
  getFirstZodErrorMessage,
  getFormDataStrings,
} from "@/lib/validation/forms";

export type GenerateIdeasState = {
  error: string | null;
};

export async function generateIdeasAction(
  _prevState: GenerateIdeasState,
  formData: FormData,
): Promise<GenerateIdeasState> {
  try {
    const workspaceId = await requireWorkspaceSession();

    const validationResult = generateIdeasSchema.safeParse(
      getFormDataStrings(formData, [
        "numberOfIdeas",
        "category",
        "marketFocus",
        "depth",
        "customPrompt",
      ] as const),
    );

    if (!validationResult.success) {
      return { error: getFirstZodErrorMessage(validationResult.error) };
    }

    const workspace = await prisma.workspace.findUnique({
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

    if (!workspace) {
      return { error: "Workspace was not found for this session." };
    }

    const result = await generateIdeas({
      workspace,
      numberOfIdeas: validationResult.data.numberOfIdeas,
      category: validationResult.data.category,
      marketFocus: validationResult.data.marketFocus,
      depth: validationResult.data.depth,
      customPrompt: validationResult.data.customPrompt,
    });

    for (const generatedIdea of result.ideas) {
      await prisma.$transaction(async (tx) => {
        const createdIdea = await tx.idea.create({
          data: {
            workspaceId,
            title: generatedIdea.title,
            shortDescription: generatedIdea.shortDescription,
            category: generatedIdea.category,
            status: IdeaStatus.NEW,
          },
          select: {
            id: true,
          },
        });

        const createdVersion = await tx.ideaVersion.create({
          data: {
            ideaId: createdIdea.id,
            versionNumber: 1,
            type: IdeaVersionType.INITIAL,
            title: generatedIdea.title,
            shortDescription: generatedIdea.shortDescription,
            fullDescription: generatedIdea.fullDescription,
            category: generatedIdea.category,
            targetAudience: generatedIdea.targetAudience,
            problem: generatedIdea.problem,
            solution: generatedIdea.solution,
            monetization: generatedIdea.monetization,
            mvpFeatures: generatedIdea.mvpFeatures,
            risks: generatedIdea.risks,
            firstSteps: generatedIdea.firstSteps,
            overallScore: generatedIdea.scores.overall,
            marketScore: generatedIdea.scores.market,
            feasibilityScore: generatedIdea.scores.feasibility,
            monetizationScore: generatedIdea.scores.monetization,
            personalFitScore: generatedIdea.scores.personalFit,
            rawAiResponse: generatedIdea,
          },
          select: {
            id: true,
          },
        });

        await tx.idea.update({
          where: {
            id: createdIdea.id,
          },
          data: {
            currentVersionId: createdVersion.id,
          },
        });
      });
    }

    revalidatePath("/ideas");
    revalidatePath("/dashboard");
    revalidatePath("/usage");
  } catch (error) {
    console.error("generateIdeasAction failed", error);
    return {
      error: "Unable to generate ideas right now. Check the server log and try again.",
    };
  }

  redirect("/ideas");
}
