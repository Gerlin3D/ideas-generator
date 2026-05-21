import { z } from "zod";

export const INVALID_CREDENTIALS_ERROR = "Invalid workspace name or password";

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
