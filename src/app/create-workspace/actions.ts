"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setWorkspaceSession } from "@/lib/auth/session";

export type CreateWorkspaceState = {
  error: string | null;
};

const initialState: CreateWorkspaceState = {
  error: null,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createWorkspaceAction(
  _prevState: CreateWorkspaceState,
  formData: FormData,
): Promise<CreateWorkspaceState> {
  const name = getString(formData, "name");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");
  const creationCode = getString(formData, "creationCode");

  if (!name || !password || !confirmPassword || !creationCode) {
    return { error: "Complete all fields to create a workspace." };
  }

  if (name.length < 3) {
    return { error: "Workspace name must be at least 3 characters long." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Password confirmation does not match." };
  }

  if (!process.env.PROFILE_CREATION_CODE) {
    return { error: "PROFILE_CREATION_CODE is not configured on the server." };
  }

  if (!process.env.SESSION_SECRET) {
    return { error: "SESSION_SECRET is not configured on the server." };
  }

  if (creationCode !== process.env.PROFILE_CREATION_CODE) {
    return { error: "Invalid creation code." };
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

  const passwordHash = await bcrypt.hash(password, 12);

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
  redirect("/profile");
}

export { initialState };
