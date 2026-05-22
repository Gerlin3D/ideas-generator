type PublicShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PublicShell({
  title,
  description,
  children,
}: PublicShellProps) {
  return (
    <div className="min-h-screen bg-background bg-lab-grid text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-8 rounded-[28px] border border-border bg-card/70 p-6 shadow-panel backdrop-blur">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sky-200">
              Private AI Lab
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                {description}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
