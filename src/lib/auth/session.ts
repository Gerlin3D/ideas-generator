import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  workspaceId: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required to manage workspace sessions.");
  }

  return secret;
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string) {
  const decoded = Buffer.from(value, "base64url").toString("utf8");
  return JSON.parse(decoded) as SessionPayload;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionValue(workspaceId: string) {
  const payload = encodePayload({
    workspaceId,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  });

  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function readSessionValue(sessionValue?: string | null) {
  if (!sessionValue) {
    return null;
  }

  const separatorIndex = sessionValue.lastIndexOf(".");

  if (separatorIndex === -1) {
    return null;
  }

  const payload = sessionValue.slice(0, separatorIndex);
  const signature = sessionValue.slice(separatorIndex + 1);

  if (!payload || !signature) {
    return null;
  }

  try {
    const expectedSignature = signPayload(payload);
    const signaturesMatch =
      signature.length === expectedSignature.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

    if (!signaturesMatch) {
      return null;
    }

    const session = decodePayload(payload);

    if (
      !session.workspaceId ||
      typeof session.workspaceId !== "string" ||
      typeof session.expiresAt !== "number"
    ) {
      return null;
    }

    if (session.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function setWorkspaceSession(workspaceId: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, createSessionValue(workspaceId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearWorkspaceSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentWorkspaceId() {
  const cookieStore = await cookies();
  const session = readSessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return session?.workspaceId ?? null;
}

export async function requireWorkspaceSession() {
  const workspaceId = await getCurrentWorkspaceId();

  if (!workspaceId) {
    redirect("/login");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!workspace) {
    await clearWorkspaceSession();
    redirect("/login");
  }

  return workspaceId;
}
