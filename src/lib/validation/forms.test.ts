import { describe, expect, it } from "vitest";
import { createWorkspaceSchema } from "./forms";

const validWorkspaceData = {
  name: "Acorn Lab",
  password: "12345",
  confirmPassword: "12345",
};

describe("createWorkspaceSchema", () => {
  it("accepts valid registration data without a creation code", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty workspace name", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      name: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Complete all fields to create a workspace.");
  });

  it("rejects a workspace name shorter than 3 characters", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      name: "ra",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Workspace name must be at least 3 characters long.");
  });

  it("rejects an empty password", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      password: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Complete all fields to create a workspace.",
    );
  });

  it("rejects an empty password confirmation", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Complete all fields to create a workspace.",
    );
  });

  it("rejects a password shorter than 5 characters", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      password: "123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Password must be at least 5 characters long.");
  });

  it("rejects a password confirmation mismatch", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      confirmPassword: "12346",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Password confirmation does not match.");
  });

  it("accepts extra creationCode data without requiring it", () => {
    const result = createWorkspaceSchema.safeParse({
      ...validWorkspaceData,
      creationCode: "",
    });

    expect(result.success).toBe(true);
  });
});