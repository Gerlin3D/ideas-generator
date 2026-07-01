import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { RouteCard } from "@/components/route-card";
import { CreateWorkspaceForm } from "@/app/create-workspace/form";
import { getCurrentWorkspaceId } from "@/lib/auth/session";

export default async function CreateWorkspacePage() {
  const workspaceId = await getCurrentWorkspaceId();

  if (workspaceId) {
    redirect("/profile");
  }

  return (
    <PublicShell
      title="Create Workspace"
      description="Create a private idea workspace. Successful setup signs you in immediately and moves you into profile configuration."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
            /create-workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Provision a private workspace
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This is your personal space for quick idea generation!
          </p>

          <div className="mt-8">
            <CreateWorkspaceForm />
          </div>
        </section>

        <div className="grid gap-6">
          <RouteCard
            eyebrow="Security"
            title="Private-first flow"
            description="This setup avoids public signup, keeps credentials server-side, and prepares the exact workspace session model we will reuse for login and protected pages."
          />
          <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
              Existing workspace?
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Continue to login
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              If the workspace already exists, use the private login flow
              instead.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/30 hover:text-white"
            >
              Go to login
            </Link>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
