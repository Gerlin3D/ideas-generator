"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceSession } from "@/lib/auth/session";
import {
  getFirstZodErrorMessage,
  getFormDataStrings,
  parseCommaSeparatedList,
  profileSchema,
} from "@/lib/validation/forms";

export type ProfileState = {
  error: string | null;
  success: string | null;
};

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  try {
    const workspaceId = await requireWorkspaceSession();

    const validationResult = profileSchema.safeParse(
      getFormDataStrings(formData, [
        "description",
        "skills",
        "interests",
        "goals",
        "constraints",
        "preferredMarkets",
        "preferredBusinessModels",
        "budgetLevel",
        "riskLevel",
        "availableTime",
        "additionalContext",
        "monthlyBudgetUsd",
      ] as const),
    );

    if (!validationResult.success) {
      return {
        error: getFirstZodErrorMessage(validationResult.error),
        success: null,
      };
    }

    const data = validationResult.data;

    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        description: data.description,
        skills: parseCommaSeparatedList(data.skills),
        interests: parseCommaSeparatedList(data.interests),
        goals: parseCommaSeparatedList(data.goals),
        constraints: parseCommaSeparatedList(data.constraints),
        preferredMarkets: parseCommaSeparatedList(data.preferredMarkets),
        preferredBusinessModels: parseCommaSeparatedList(
          data.preferredBusinessModels,
        ),
        budgetLevel: data.budgetLevel,
        riskLevel: data.riskLevel,
        availableTime: data.availableTime,
        additionalContext: data.additionalContext,
        monthlyBudgetUsd: data.monthlyBudgetUsd,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      error: null,
      success: "Workspace profile saved.",
    };
  } catch (error) {
    console.error("updateProfileAction failed", error);
    return {
      error: "Unable to save the workspace profile right now. Check the server log and try again.",
      success: null,
    };
  }
}
