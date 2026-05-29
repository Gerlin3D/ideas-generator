"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function deleteIdeaAction(formData: FormData) {
  const workspaceId = await requireWorkspaceSession();
  const ideaId = String(formData.get("ideaId") ?? "").trim();

  if (!ideaId) {
    redirect("/ideas");
  }

  await prisma.idea.deleteMany({
    where: {
      id: ideaId,
      workspaceId,
    },
  });

  revalidatePath("/ideas");
  revalidatePath("/dashboard");
  revalidatePath("/usage");
  redirect("/ideas");
}
