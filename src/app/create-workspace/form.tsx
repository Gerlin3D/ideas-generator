"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createWorkspaceAction } from "@/app/create-workspace/actions";

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
      {pending ? "Creating workspace..." : "Create Workspace"}
    </button>
  );
}

export function CreateWorkspaceForm() {
  const [state, formAction] = useActionState(createWorkspaceAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Workspace name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="organization"
          placeholder="Acorn Lab"
          className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimum 5 characters"
          className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-200"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the password"
          className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-slate-400">
          After creation, the workspace signs in automatically and opens the
          profile setup page.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
