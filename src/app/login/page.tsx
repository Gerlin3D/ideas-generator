import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";

export default function LoginPage() {
  return (
    <AppShell
      title="Ideas Generator"
      description="Enter your private idea workspace. This first scaffold gives us the route structure, UI direction, and Prisma-ready project setup before we wire auth."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <RouteCard
          eyebrow="/login"
          title="Workspace Login"
          description="Next step will connect this screen to workspace auth with httpOnly cookies, generic login errors, and server-side validation."
        />
        <RouteCard
          eyebrow="Auth Flow"
          title="Step 2 Ready"
          description="The scaffold is intentionally thin: no public workspace list, no email auth, and no client-side secret handling."
        />
      </div>
    </AppShell>
  );
}
