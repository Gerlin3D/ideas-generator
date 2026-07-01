"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setWorkspaceSession } from "@/lib/auth/session";
import {
  createWorkspaceSchema,
  getFirstZodErrorMessage,
  getFormDataStrings,
} from "@/lib/validation/forms";

export type CreateWorkspaceState = {
  error: string | null;
};

export async function createWorkspaceAction(
  _prevState: CreateWorkspaceState,
  formData: FormData,
): Promise<CreateWorkspaceState> {
  try {
    const validationResult = createWorkspaceSchema.safeParse(
      getFormDataStrings(formData, [
        "name",
        "password",
        "confirmPassword",
      ] as const),
    );

    if (!validationResult.success) {
      return { error: getFirstZodErrorMessage(validationResult.error) };
    }

    const { name, password } = validationResult.data;

    if (!process.env.SESSION_SECRET) {
      return { error: "SESSION_SECRET is not configured on the server." };
    }

    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (existingWorkspace) {
      return { error: "Workspace name is already taken." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const workspace = await prisma.workspace.create({
      data: {
        name,
        passwordHash,
        skills: [],
        interests: [],
        goals: [],
        constraints: [],
        preferredMarkets: [],
        preferredBusinessModels: [],
      },
      select: {
        id: true,
      },
    });

    await setWorkspaceSession(workspace.id);
  } catch (error) {
    console.error("createWorkspaceAction failed", error);
    return {
      error: "Unable to create workspace right now. Check the server log and try again.",
    };
  }

  redirect("/profile");
}
