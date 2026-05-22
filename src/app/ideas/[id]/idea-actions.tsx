"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  generateMvpConceptAction,
  realityCheckAction,
  refineIdeaAction,
} from "@/app/ideas/[id]/actions";
import { AI_DEPTHS } from "@/lib/ai/types";

const initialState = {
  error: null,
};

function SubmitButton({
  idleLabel,
  busyLabel,
}: {
  idleLabel: string;
  busyLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? busyLabel : idleLabel}
    </button>
  );
}

function IdeaActionForm({
  actionTitle,
  actionDescription,
  ideaId,
  submitIdleLabel,
  submitBusyLabel,
  formAction,
}: {
  actionTitle: string;
  actionDescription: string;
  ideaId: string;
  submitIdleLabel: string;
  submitBusyLabel: string;
  formAction: typeof refineIdeaAction;
}) {
  const [state, action] = useActionState(formAction, initialState);

  return (
    <form action={action} className="rounded-[24px] border border-border bg-card/80 p-6 shadow-panel backdrop-blur">
      <input type="hidden" name="ideaId" value={ideaId} />
      <h2 className="text-lg font-semibold text-white">{actionTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{actionDescription}</p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor={`${actionTitle}-depth`} className="text-sm font-medium text-slate-200">
            AI depth
          </label>
          <select
            id={`${actionTitle}-depth`}
            name="depth"
            defaultValue="smart"
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
          >
            {AI_DEPTHS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${actionTitle}-prompt`} className="text-sm font-medium text-slate-200">
            Extra instructions
          </label>
          <textarea
            id={`${actionTitle}-prompt`}
            name="customPrompt"
            rows={4}
            placeholder="Optional request to steer this operation."
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
          />
        </div>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}

      <div className="mt-5">
        <SubmitButton idleLabel={submitIdleLabel} busyLabel={submitBusyLabel} />
      </div>
    </form>
  );
}

export function IdeaActions({ ideaId }: { ideaId: string }) {
  return (
    <div className="grid gap-6">
      <IdeaActionForm
        ideaId={ideaId}
        actionTitle="Refine idea"
        actionDescription="Ask the AI to sharpen the target audience, clarify the problem, improve monetization, and make the concept more practical."
        submitIdleLabel="Refine Idea"
        submitBusyLabel="Refining idea..."
        formAction={refineIdeaAction}
      />

      <IdeaActionForm
        ideaId={ideaId}
        actionTitle="Generate MVP concept"
        actionDescription="Turn the current idea into a more practical MVP-oriented version with clearer scope, stronger features, and a tighter first-steps plan."
        submitIdleLabel="Generate MVP Concept"
        submitBusyLabel="Generating MVP concept..."
        formAction={generateMvpConceptAction}
      />

      <IdeaActionForm
        ideaId={ideaId}
        actionTitle="Reality check"
        actionDescription="Challenge the current idea with a harsher lens: market risks, execution pitfalls, and the cheapest ways to validate or kill it."
        submitIdleLabel="Run Reality Check"
        submitBusyLabel="Running reality check..."
        formAction={realityCheckAction}
      />
    </div>
  );
}
