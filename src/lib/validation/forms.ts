import { z } from "zod";

export const INVALID_CREDENTIALS_ERROR = "Invalid workspace name or password";
export const budgetLevelOptions = ["LOW", "MEDIUM", "HIGH"] as const;
export const riskLevelOptions = ["LOW", "MEDIUM", "HIGH"] as const;

export const createWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Complete all fields to create a workspace.")
      .min(3, "Workspace name must be at least 3 characters long."),
    password: z
      .string()
      .min(1, "Complete all fields to create a workspace.")
      .min(5, "Password must be at least 5 characters long."),
    confirmPassword: z
      .string()
      .min(1, "Complete all fields to create a workspace."),
    creationCode: z
      .string()
      .trim()
      .min(1, "Complete all fields to create a workspace."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  name: z.string().trim().min(1, INVALID_CREDENTIALS_ERROR),
  password: z.string().min(1, INVALID_CREDENTIALS_ERROR),
});

const optionalTrimmedString = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value.length > 0 ? value : null));

const optionalEnumValue = <TValue extends readonly [string, ...string[]]>(
  values: TValue,
) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmedValue = value.trim();
      return trimmedValue.length === 0 ? null : trimmedValue;
    },
    z.enum(values).nullable(),
  );

export const profileSchema = z.object({
  description: optionalTrimmedString,
  skills: z.string(),
  interests: z.string(),
  goals: z.string(),
  constraints: z.string(),
  preferredMarkets: z.string(),
  preferredBusinessModels: z.string(),
  budgetLevel: optionalEnumValue(budgetLevelOptions),
  riskLevel: optionalEnumValue(riskLevelOptions),
  availableTime: optionalTrimmedString,
  additionalContext: optionalTrimmedString,
  monthlyBudgetUsd: z
    .string()
    .transform((value) => value.trim())
    .transform((value, context) => {
      if (value.length === 0) {
        return null;
      }

      const parsedValue = Number(value);

      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Monthly budget must be a valid non-negative number.",
        });
        return z.NEVER;
      }

      return parsedValue;
    }),
});

export function getFormDataStrings<TField extends string>(
  formData: FormData,
  fields: readonly TField[],
) {
  return fields.reduce(
    (accumulator, field) => {
      const value = formData.get(field);
      accumulator[field] = typeof value === "string" ? value : "";
      return accumulator;
    },
    {} as Record<TField, string>,
  );
}

export function getFirstZodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid form submission.";
}

export function parseCommaSeparatedList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
