import { deleteIdeaAction } from "@/app/ideas/actions";
import { cn } from "@/lib/utils";

type DeleteIdeaButtonProps = {
  ideaId: string;
  className?: string;
  label?: string;
};

export function DeleteIdeaButton({
  ideaId,
  className,
  label = "Delete",
}: DeleteIdeaButtonProps) {
  return (
    <form action={deleteIdeaAction}>
      <input type="hidden" name="ideaId" value={ideaId} />
      <button
        type="submit"
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/15 hover:text-white",
          className,
        )}
      >
        {label}
      </button>
    </form>
  );
}
