import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWorkspaceAction } from "./actions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { setWorkspaceSession } from "@/lib/auth/session";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workspace: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock("@/lib/auth/session", () => ({
  setWorkspaceSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

function createValidFormData() {
  const formData = new FormData();

  formData.set("name", "Acorn Lab");
  formData.set("password", "12345");
  formData.set("confirmPassword", "12345");

  return formData;
}

describe("createWorkspaceAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SESSION_SECRET = "test-secret";
  });

  it("returns a validation error for empty form data", async () => {
    const formData = new FormData();

    const result = await createWorkspaceAction({ error: null }, formData);

    expect(result.error).toBe("Complete all fields to create a workspace.");
    expect(prisma.workspace.findFirst).not.toHaveBeenCalled();
    expect(prisma.workspace.create).not.toHaveBeenCalled();
  });


  it("returns a config error when SESSION_SECRET is missing", async () => {
    delete process.env.SESSION_SECRET;

    const result = await createWorkspaceAction(
      { error: null },
      createValidFormData(),
    );

    expect(result.error).toBe("SESSION_SECRET is not configured on the server.");
    expect(prisma.workspace.findFirst).not.toHaveBeenCalled();
    expect(prisma.workspace.create).not.toHaveBeenCalled();
  });


  it("returns an error when workspace name is already taken", async () => {
    vi.mocked(prisma.workspace.findFirst).mockResolvedValue({
      id: "existing-workspace",
    } as Awaited<ReturnType<typeof prisma.workspace.findFirst>>);

    const result = await createWorkspaceAction(
      { error: null },
      createValidFormData(),
    );

    expect(result.error).toBe("Workspace name is already taken.");
    expect(prisma.workspace.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: "Acorn Lab",
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });
    expect(prisma.workspace.create).not.toHaveBeenCalled();
  });

  it("creates a workspace, starts a session, and redirects to profile", async () => {
    vi.mocked(prisma.workspace.findFirst).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
    vi.mocked(prisma.workspace.create).mockResolvedValue({
      id: "new-workspace",
    } as Awaited<ReturnType<typeof prisma.workspace.create>>);

    await expect(
      createWorkspaceAction({ error: null }, createValidFormData()),
    ).rejects.toThrow("NEXT_REDIRECT:/profile");

    expect(bcrypt.hash).toHaveBeenCalledWith("12345", 10);
    expect(prisma.workspace.create).toHaveBeenCalledWith({
      data: {
        name: "Acorn Lab",
        passwordHash: "hashed-password",
        skills: [],
        interests: [],
        goals: [],
        constraints: [],
        preferredMarkets: [],
        preferredBusinessModels: [],
      },
      select: {
        id: true,
      },
    });
    expect(setWorkspaceSession).toHaveBeenCalledWith("new-workspace");
    expect(redirect).toHaveBeenCalledWith("/profile");
  });

  it("returns a generic error when workspace creation fails", async () => {
    vi.mocked(prisma.workspace.findFirst).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
    vi.mocked(prisma.workspace.create).mockRejectedValue(new Error("DB down"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => { });

    const result = await createWorkspaceAction(
      { error: null },
      createValidFormData(),
    );

    expect(result.error).toBe(
      "Unable to create workspace right now. Check the server log and try again.",
    );
    expect(setWorkspaceSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
