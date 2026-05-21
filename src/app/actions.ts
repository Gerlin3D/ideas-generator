"use server";

import { redirect } from "next/navigation";
import { clearWorkspaceSession } from "@/lib/auth/session";

export async function logoutAction() {
  await clearWorkspaceSession();
  redirect("/login");
}
