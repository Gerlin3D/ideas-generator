import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { LoginForm } from "@/app/login/form";
import { getCurrentWorkspaceId } from "@/lib/auth/session";

export default async function LoginPage() {
  const workspaceId = await getCurrentWorkspaceId();

  if (workspaceId) {
    redirect("/dashboard");
  }

  return (
    <AppShell
      title="Ideas Generator"
      description="Enter your private idea workspace. The login flow is private-first, uses signed httpOnly sessions, and returns only a generic auth error when credentials do not match."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
            /login
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Enter your private idea workspace
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Sign in with the workspace name and password only. No workspace list
            is exposed, and failed attempts always return the same message.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </section>

        <div className="grid gap-6">
          <RouteCard
            eyebrow="Privacy"
            title="Generic auth responses"
            description="The flow never reveals whether the workspace exists, which keeps the login surface aligned with the private-first MVP requirements."
          />
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
              Need a workspace?
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Create one first
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              New workspaces are provisioned through the protected creation-code
              flow.
            </p>
            <Link
              href="/create-workspace"
              className="mt-5 inline-flex rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/30 hover:text-white"
            >
              Create workspace
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
