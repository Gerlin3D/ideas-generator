import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getCurrentWorkspaceId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const publicNavigation = [
  { href: "/login", label: "Login" },
  { href: "/create-workspace", label: "Create Workspace" },
];

const privateNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/generate", label: "Generate" },
  { href: "/ideas", label: "Ideas" },
  { href: "/usage", label: "Usage" },
];

export async function AppShell({ title, description, children }: AppShellProps) {
  const workspaceId = await getCurrentWorkspaceId();
  const navigation = workspaceId ? privateNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-background bg-lab-grid text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-6 rounded-[28px] border border-border bg-card/70 p-6 shadow-panel backdrop-blur xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sky-200">
              Private AI Lab
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/30 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}

            {workspaceId ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={cn(
                    "rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/30 hover:text-white",
                  )}
                >
                  Logout
                </button>
              </form>
            ) : null}
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
