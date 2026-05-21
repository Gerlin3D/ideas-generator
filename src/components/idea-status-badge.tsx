import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/lib/ideas";

const toneMap: Record<string, string> = {
  NEW: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  INTERESTING: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  RESEARCHING: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  VALIDATING: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  BUILDING: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  PAUSED: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  DONE: "border-lime-400/20 bg-lime-400/10 text-lime-200",
  REJECTED: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

export function IdeaStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        toneMap[status] ?? "border-slate-400/20 bg-slate-400/10 text-slate-200",
      )}
    >
      {formatEnumLabel(status)}
    </span>
  );
}
