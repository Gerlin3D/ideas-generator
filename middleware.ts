import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  isProtectedRoute,
  isPublicAuthRoute,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/config";

type SessionPayload = {
  workspaceId: string;
  expiresAt: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(`${normalized}${padding}`);
}

function decodePayload(value: string) {
  const decoded = decodeBase64Url(value);
  return JSON.parse(decoded) as SessionPayload;
}

function hasValidSession(sessionValue?: string) {
  if (!sessionValue) {
    return false;
  }

  const separatorIndex = sessionValue.lastIndexOf(".");

  if (separatorIndex === -1) {
    return false;
  }

  const payload = sessionValue.slice(0, separatorIndex);
  const signature = sessionValue.slice(separatorIndex + 1);

  if (!payload || !signature) {
    return false;
  }

  try {
    const session = decodePayload(payload);

    if (!signature.trim()) {
      return false;
    }

    return (
      typeof session.workspaceId === "string" &&
      session.workspaceId.length > 0 &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasValidSession(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/create-workspace",
    "/dashboard/:path*",
    "/profile/:path*",
    "/generate/:path*",
    "/ideas/:path*",
    "/usage/:path*",
  ],
};
