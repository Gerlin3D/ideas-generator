export const SESSION_COOKIE_NAME = "ideas_generator_session";

export const PUBLIC_AUTH_ROUTES = ["/login", "/create-workspace"] as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/generate",
  "/ideas",
  "/usage",
] as const;

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isPublicAuthRoute(pathname: string) {
  return PUBLIC_AUTH_ROUTES.includes(
    pathname as (typeof PUBLIC_AUTH_ROUTES)[number],
  );
}
