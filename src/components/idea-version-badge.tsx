import { formatEnumLabel } from "@/lib/ideas";

export function IdeaVersionBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200">
      {formatEnumLabel(type)}
    </span>
  );
}
