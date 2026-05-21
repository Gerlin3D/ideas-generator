"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setWorkspaceSession } from "@/lib/auth/session";
import {
  getFormDataStrings,
  INVALID_CREDENTIALS_ERROR,
  loginSchema,
} from "@/lib/validation/forms";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    const validationResult = loginSchema.safeParse(
      getFormDataStrings(formData, ["name", "password"] as const),
    );

    if (!validationResult.success) {
      return { error: INVALID_CREDENTIALS_ERROR };
    }

    const { name, password } = validationResult.data;

    if (!process.env.SESSION_SECRET) {
      return { error: "SESSION_SECRET is not configured on the server." };
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!workspace) {
      return { error: INVALID_CREDENTIALS_ERROR };
    }

    const passwordMatches = await bcrypt.compare(password, workspace.passwordHash);

    if (!passwordMatches) {
      return { error: INVALID_CREDENTIALS_ERROR };
    }

    await setWorkspaceSession(workspace.id);
  } catch (error) {
    console.error("loginAction failed", error);
    return { error: "Unable to sign in right now. Check the server log and try again." };
  }

  redirect("/dashboard");
}
export { INVALID_CREDENTIALS_ERROR };
