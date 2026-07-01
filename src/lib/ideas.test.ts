import { describe, expect, it } from "vitest";
import { getCurrentIdeaVersion } from "./ideas";

function createVersion(id: string, versionNumber: number, createdAt: Date) {
  return {
    id,
    versionNumber,
    title: `Title ${id}`,
    shortDescription: `Description ${id}`,
    type: "INITIAL",
    category: null,
    createdAt,
  };
}

describe("getCurrentIdeaVersion", () => {
  it("returns currentVersion when it exists", () => {
    const v1 = createVersion("v1", 1, new Date("2026-01-01"));
    const v2 = createVersion("v2", 2, new Date("2026-01-02"));

    const result = getCurrentIdeaVersion({
      currentVersionId: null,
      currentVersion: v1,
      versions: [v1, v2],
    });

    expect(result).toBe(v1);
  });

  it("returns null when versions is empty", () => {
    const result = getCurrentIdeaVersion({
      currentVersionId: null,
      currentVersion: null,
      versions: [],
    });

    expect(result).toBe(null);
  });

  it("returns the version matching currentVersionId", () => {
    const v1 = createVersion("v1", 1, new Date("2026-01-01"));
    const v2 = createVersion("v2", 2, new Date("2026-01-02"));

    const result = getCurrentIdeaVersion({
      currentVersionId: "v1",
      currentVersion: null,
      versions: [v1, v2],
    });

    expect(result).toBe(v1);
  });

  it("returns the highest versionNumber when currentVersionId does not match", () => {
    const v1 = createVersion("v1", 1, new Date("2026-01-01"));
    const v2 = createVersion("v2", 2, new Date("2026-01-02"));

    const result = getCurrentIdeaVersion({
      currentVersionId: "v3",
      currentVersion: null,
      versions: [v1, v2],
    });

    expect(result).toBe(v2);
  });

  it("returns the newest createdAt when versionNumber is the same", () => {
    const v1 = createVersion("v1", 2, new Date("2026-01-01"));
    const v2 = createVersion("v2", 2, new Date("2026-01-02"));

    const result = getCurrentIdeaVersion({
      currentVersionId: null,
      currentVersion: null,
      versions: [v1, v2],
    });

    expect(result).toBe(v2);
  });

  it("returns the latest version regardless of versions order", () => {
    const v1 = createVersion("v1", 1, new Date("2026-01-01"));
    const v2 = createVersion("v2", 2, new Date("2026-01-02"));
    const v3 = createVersion("v3", 3, new Date("2026-01-03"));

    const result = getCurrentIdeaVersion({
      currentVersionId: null,
      currentVersion: null,
      versions: [v1, v3, v2],
    });

    expect(result).toBe(v3);
  });
});