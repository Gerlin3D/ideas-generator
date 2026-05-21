type RouteCardProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RouteCard({ eyebrow, title, description }: RouteCardProps) {
  return (
    <section className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </section>
  );
}
