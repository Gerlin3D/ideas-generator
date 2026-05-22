"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AI_DEPTHS, MARKET_FOCUS_VALUES } from "@/lib/ai/types";
import { generateIdeasAction } from "@/app/generate/actions";

const initialState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Generating ideas..." : "Generate Ideas"}
    </button>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-200">
      {children}
    </label>
  );
}

export function GenerateIdeasForm() {
  const [state, formAction] = useActionState(generateIdeasAction, initialState);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="numberOfIdeas">Number of ideas</FieldLabel>
          <input
            id="numberOfIdeas"
            name="numberOfIdeas"
            type="number"
            min={1}
            max={10}
            defaultValue={3}
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
          />
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="marketFocus">Market focus</FieldLabel>
          <select
            id="marketFocus"
            name="marketFocus"
            defaultValue="GLOBAL"
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
          >
            {MARKET_FOCUS_VALUES.map((option) => (
              <option key={option} value={option}>
                {option === "RU"
                  ? "RU"
                  : option === "GLOBAL"
                    ? "Global"
                    : "Both"}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="category">Idea type or category</FieldLabel>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="B2B SaaS, niche marketplace, AI service"
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
          />
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="depth">AI depth</FieldLabel>
          <select
            id="depth"
            name="depth"
            defaultValue="free"
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
          >
            {AI_DEPTHS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 md:col-span-2">
          <FieldLabel htmlFor="customPrompt">Custom prompt or request</FieldLabel>
          <textarea
            id="customPrompt"
            name="customPrompt"
            rows={5}
            placeholder="Add extra constraints, niches, or monetization angles you want the AI to emphasize."
            className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
          />
        </div>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          The generation request always includes the current workspace profile,
          then stores every returned idea as a new `Idea` plus an initial
          `IdeaVersion`.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
