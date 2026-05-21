type IdeaVersionSummary = {
  id: string;
  versionNumber: number;
  title: string;
  shortDescription: string;
  type: string;
  category: string | null;
  targetAudience?: string | null;
  problem?: string | null;
  solution?: string | null;
  fullDescription?: string | null;
  monetization?: string[];
  mvpFeatures?: string[];
  risks?: string[];
  firstSteps?: string[];
  overallScore?: number | null;
  marketScore?: number | null;
  feasibilityScore?: number | null;
  monetizationScore?: number | null;
  personalFitScore?: number | null;
  createdAt: Date;
};

type IdeaSummary = {
  currentVersionId?: string | null;
  currentVersion?: IdeaVersionSummary | null;
  versions: IdeaVersionSummary[];
};

export function getCurrentIdeaVersion<TIdea extends IdeaSummary>(idea: TIdea) {
  if (idea.currentVersion) {
    return idea.currentVersion;
  }

  if (!idea.versions.length) {
    return null;
  }

  if (idea.currentVersionId) {
    const matchedVersion = idea.versions.find(
      (version) => version.id === idea.currentVersionId,
    );

    if (matchedVersion) {
      return matchedVersion;
    }
  }

  return [...idea.versions].sort((left, right) => {
    if (left.versionNumber !== right.versionNumber) {
      return right.versionNumber - left.versionNumber;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  })[0];
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}
