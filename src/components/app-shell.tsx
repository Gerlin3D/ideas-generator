import { logoutAction } from "@/app/actions";
import { getCurrentWorkspaceId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { SidebarNav } from "@/components/sidebar-links";

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
  { href: "/generate", label: "Generate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/ideas", label: "Ideas" },
  { href: "/usage", label: "Usage" },
];

export async function AppShell({ title, description, children }: AppShellProps) {
  const workspaceId = await getCurrentWorkspaceId();
  const navigation = workspaceId ? privateNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-background bg-lab-grid text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:h-screen lg:max-h-screen lg:flex-row lg:gap-6 lg:overflow-hidden lg:px-8 lg:py-6">
        <aside className="mb-6 rounded-[28px] border border-border bg-card/70 p-5 shadow-panel backdrop-blur lg:mb-0 lg:flex lg:h-full lg:w-72 lg:flex-col lg:self-stretch">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sky-200">
              Private AI Lab
            </span>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Ideas Generator
              </h1>
              <p className="text-sm leading-6 text-slate-300">
                Workspace-first idea lab for generating, refining, and tracking
                business concepts.
              </p>
            </div>
          </div>

          <SidebarNav items={navigation} />
          
          {workspaceId ? (
            <form action={logoutAction} className="mt-6 lg:mt-auto">
              <button
                type="submit"
                className={cn(
                  "w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 transition hover:border-sky-400/30 hover:text-white",
                )}
              >
                Logout
              </button>
            </form>
          ) : null}
        </aside>

        <div className="min-w-0 flex-1 lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
          <header className="mb-6 rounded-[28px] border border-border bg-card/70 p-6 shadow-panel backdrop-blur lg:flex-shrink-0">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
                Workspace View
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {title}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-slate-300">
                {description}
              </p>
            </div>
          </header>

          <main className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
