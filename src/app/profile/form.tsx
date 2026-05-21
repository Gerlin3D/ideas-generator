"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialState, updateProfileAction } from "@/app/profile/actions";
import {
  budgetLevelOptions,
  riskLevelOptions,
} from "@/lib/validation/forms";

type ProfileFormValues = {
  description: string;
  skills: string;
  interests: string;
  goals: string;
  constraints: string;
  preferredMarkets: string;
  preferredBusinessModels: string;
  budgetLevel: string;
  riskLevel: string;
  availableTime: string;
  additionalContext: string;
  monthlyBudgetUsd: string;
};

type ProfileFormProps = {
  workspaceName: string;
  initialValues: ProfileFormValues;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving profile..." : "Save Profile"}
    </button>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-slate-500">{children}</p>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-28 rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="rounded-2xl border border-border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
    />
  );
}

export function ProfileForm({
  workspaceName,
  initialValues,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-2">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">
          Workspace
        </p>
        <h2 className="text-2xl font-semibold text-white">{workspaceName}</h2>
        <p className="text-sm leading-6 text-slate-300">
          These settings become the default context for future idea generation,
          refinement, and evaluation.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-200">
            Description
          </label>
          <TextArea
            id="description"
            name="description"
            defaultValue={initialValues.description}
            placeholder="Describe the kind of founder, operator, or builder this workspace represents."
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="skills" className="text-sm font-medium text-slate-200">
            Skills
          </label>
          <TextArea
            id="skills"
            name="skills"
            defaultValue={initialValues.skills}
            placeholder="sales, automation, product strategy"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label htmlFor="interests" className="text-sm font-medium text-slate-200">
            Interests
          </label>
          <TextArea
            id="interests"
            name="interests"
            defaultValue={initialValues.interests}
            placeholder="B2B SaaS, creator tools, local services"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label htmlFor="goals" className="text-sm font-medium text-slate-200">
            Goals
          </label>
          <TextArea
            id="goals"
            name="goals"
            defaultValue={initialValues.goals}
            placeholder="reach first revenue quickly, validate demand, build lean"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label htmlFor="constraints" className="text-sm font-medium text-slate-200">
            Constraints
          </label>
          <TextArea
            id="constraints"
            name="constraints"
            defaultValue={initialValues.constraints}
            placeholder="limited time, solo founder, no-code preferred"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="preferredMarkets"
            className="text-sm font-medium text-slate-200"
          >
            Preferred markets
          </label>
          <TextArea
            id="preferredMarkets"
            name="preferredMarkets"
            defaultValue={initialValues.preferredMarkets}
            placeholder="US, Europe, remote-first"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="preferredBusinessModels"
            className="text-sm font-medium text-slate-200"
          >
            Preferred business models
          </label>
          <TextArea
            id="preferredBusinessModels"
            name="preferredBusinessModels"
            defaultValue={initialValues.preferredBusinessModels}
            placeholder="subscription, productized service, one-time setup fee"
          />
          <FieldHint>Comma-separated values for MVP.</FieldHint>
        </div>

        <div className="grid gap-2">
          <label htmlFor="budgetLevel" className="text-sm font-medium text-slate-200">
            Budget level
          </label>
          <SelectInput
            id="budgetLevel"
            name="budgetLevel"
            defaultValue={initialValues.budgetLevel}
          >
            <option value="">Not specified</option>
            {budgetLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </option>
            ))}
          </SelectInput>
        </div>

        <div className="grid gap-2">
          <label htmlFor="riskLevel" className="text-sm font-medium text-slate-200">
            Risk level
          </label>
          <SelectInput
            id="riskLevel"
            name="riskLevel"
            defaultValue={initialValues.riskLevel}
          >
            <option value="">Not specified</option>
            {riskLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </option>
            ))}
          </SelectInput>
        </div>

        <div className="grid gap-2">
          <label htmlFor="availableTime" className="text-sm font-medium text-slate-200">
            Available time
          </label>
          <TextInput
            id="availableTime"
            name="availableTime"
            defaultValue={initialValues.availableTime}
            placeholder="10 hours per week"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="monthlyBudgetUsd"
            className="text-sm font-medium text-slate-200"
          >
            Monthly budget USD
          </label>
          <TextInput
            id="monthlyBudgetUsd"
            name="monthlyBudgetUsd"
            inputMode="decimal"
            defaultValue={initialValues.monthlyBudgetUsd}
            placeholder="500"
          />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <label
            htmlFor="additionalContext"
            className="text-sm font-medium text-slate-200"
          >
            Additional context
          </label>
          <TextArea
            id="additionalContext"
            name="additionalContext"
            defaultValue={initialValues.additionalContext}
            placeholder="Anything else the AI should know when generating ideas for this workspace."
          />
        </div>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-slate-400">
          Changes are saved only to the current workspace and will shape future
          AI prompts.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
