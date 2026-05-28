import { cn } from "@/lib/utils";

const versionTypeConfig: Record<string, { label: string; className: string }> = {
  INITIAL: {
    label: "First draft",
    className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  },
  REFINED: {
    label: "Refined",
    className: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  },
  MVP_CONCEPT: {
    label: "MVP concept",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
  REALITY_CHECK: {
    label: "Reality check",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  },
};

export function IdeaVersionBadge({ type }: { type: string }) {
  const config = versionTypeConfig[type] ?? {
    label: type,
    className: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
