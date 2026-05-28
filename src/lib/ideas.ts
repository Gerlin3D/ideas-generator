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
  rawAiResponse?: unknown;
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

export function getAgentOutputsFromRawAiResponse(rawAiResponse: unknown) {
  if (!rawAiResponse || typeof rawAiResponse !== "object") {
    return null;
  }

  const maybeAgentOutputs = (rawAiResponse as { agentOutputs?: unknown }).agentOutputs;

  if (!maybeAgentOutputs || typeof maybeAgentOutputs !== "object") {
    return null;
  }

  const agentOutputs = maybeAgentOutputs as Record<string, unknown>;
  const entries = [
    ["dreamer", "Dreamer"],
    ["builder", "Builder"],
    ["investor", "Investor"],
    ["critic", "Critic"],
    ["finalEditor", "Final editor"],
  ]
    .map(([key, label]) => ({
      key,
      label,
      text: typeof agentOutputs[key] === "string" ? agentOutputs[key].trim() : "",
    }))
    .filter((entry) => entry.text.length > 0);

  return entries.length > 0 ? entries : null;
}

function extractJsonCandidate(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    const fenced = trimmed
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    if (fenced) {
      return fenced;
    }
  }

  const objectStart = trimmed.indexOf("{");
  const arrayStart = trimmed.indexOf("[");
  const starts = [objectStart, arrayStart].filter((index) => index !== -1);

  if (starts.length > 0) {
    const start = Math.min(...starts);
    const opening = trimmed[start];
    const closing = opening === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = start; index < trimmed.length; index += 1) {
      const character = trimmed[index];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (character === "\\") {
          escaped = true;
          continue;
        }

        if (character === '"') {
          inString = false;
        }

        continue;
      }

      if (character === '"') {
        inString = true;
        continue;
      }

      if (character === opening) {
        depth += 1;
        continue;
      }

      if (character === closing) {
        depth -= 1;

        if (depth === 0) {
          return trimmed.slice(start, index + 1);
        }
      }
    }
  }

  return trimmed;
}

function tryParseAgentJson(text: string) {
  try {
    return JSON.parse(extractJsonCandidate(text)) as unknown;
  } catch {
    return null;
  }
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

export function getStructuredAgentOutputsFromRawAiResponse(rawAiResponse: unknown) {
  const agentOutputs = getAgentOutputsFromRawAiResponse(rawAiResponse);

  if (!agentOutputs) {
    return null;
  }

  return agentOutputs.map((agent) => {
    const parsed = tryParseAgentJson(agent.text);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "summary" in parsed
    ) {
      const value = parsed as Record<string, unknown>;
      const ideas = Array.isArray(value.ideas)
        ? value.ideas
            .filter(
              (item): item is Record<string, unknown> =>
                Boolean(item) && typeof item === "object" && !Array.isArray(item),
            )
            .map((idea) => ({
              title: typeof idea.title === "string" ? idea.title : "Untitled angle",
              angle: typeof idea.angle === "string" ? idea.angle : "",
              notes: toStringArray(idea.notes),
            }))
        : [];

      return {
        ...agent,
        mode: "analysis" as const,
        summary:
          typeof value.summary === "string" ? value.summary : "No summary provided.",
        strengths: toStringArray(value.strengths),
        weaknesses: toStringArray(value.weaknesses),
        ideas,
      };
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "ideas" in parsed &&
      Array.isArray((parsed as { ideas?: unknown[] }).ideas)
    ) {
      const value = parsed as { ideas: unknown[] };
      const ideas = value.ideas
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object" && !Array.isArray(item),
        )
        .map((idea) => ({
          title: typeof idea.title === "string" ? idea.title : "Untitled idea",
          angle:
            typeof idea.shortDescription === "string"
              ? idea.shortDescription
              : typeof idea.solution === "string"
                ? idea.solution
                : "",
        }));

      return {
        ...agent,
        mode: "final" as const,
        summary: `${ideas.length} synthesized ideas produced.`,
        strengths: [],
        weaknesses: [],
        ideas,
      };
    }

    return {
      ...agent,
      mode: "raw" as const,
      summary: agent.text,
      strengths: [],
      weaknesses: [],
      ideas: [],
    };
  });
}
