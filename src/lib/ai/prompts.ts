import type { GenerateIdeasInput, WorkspaceContext } from "@/lib/ai/types";

const BASE_SYSTEM_PROMPT = `You are an expert business idea analyst, startup strategist, product thinker, and practical MVP advisor.

Your task is to generate realistic money-making ideas based on the user's workspace context.

Prioritize ideas that:
- match the user's skills and interests
- can be validated quickly
- can start with low budget
- have realistic monetization
- can lead to first income
- are not too broad
- are specific enough to build or test

Avoid generic ideas unless they have a strong niche, clear audience, and realistic monetization path.

Be practical, skeptical, and specific.`;

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "Not specified";
}

function formatOptional(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Not specified";
}

export function buildWorkspaceContextBlock(workspace: WorkspaceContext) {
  return [
    `Name: ${workspace.name}`,
    `Description: ${formatOptional(workspace.description)}`,
    `Skills: ${formatList(workspace.skills)}`,
    `Interests: ${formatList(workspace.interests)}`,
    `Goals: ${formatList(workspace.goals)}`,
    `Constraints: ${formatList(workspace.constraints)}`,
    `Preferred markets: ${formatList(workspace.preferredMarkets)}`,
    `Preferred business models: ${formatList(workspace.preferredBusinessModels)}`,
    `Budget level: ${workspace.budgetLevel ?? "Not specified"}`,
    `Risk level: ${workspace.riskLevel ?? "Not specified"}`,
    `Available time: ${formatOptional(workspace.availableTime)}`,
    `Additional context: ${formatOptional(workspace.additionalContext)}`,
    `Monthly budget USD: ${
      workspace.monthlyBudgetUsd !== null && workspace.monthlyBudgetUsd !== undefined
        ? workspace.monthlyBudgetUsd
        : "Not specified"
    }`,
  ].join("\n");
}

export function getBaseSystemPrompt() {
  return BASE_SYSTEM_PROMPT;
}

export function buildGenerateIdeasPrompt(input: GenerateIdeasInput) {
  return `Generate ${input.numberOfIdeas} money-making ideas for this workspace.

Workspace context:
${buildWorkspaceContextBlock(input.workspace)}

Generation settings:
Idea type/category: ${input.category?.trim() || "Not specified"}
Market focus: ${input.marketFocus}
AI depth: ${input.depth}
Custom request: ${input.customPrompt?.trim() || "Not specified"}

Return JSON only.

Return an array of ideas. Each idea must have this structure:

{
  "title": "string",
  "shortDescription": "string",
  "fullDescription": "string",
  "category": "string",
  "targetAudience": "string",
  "problem": "string",
  "solution": "string",
  "monetization": ["string"],
  "mvpFeatures": ["string"],
  "risks": ["string"],
  "firstSteps": ["string"],
  "scores": {
    "overall": 1-10,
    "market": 1-10,
    "feasibility": 1-10,
    "monetization": 1-10,
    "personalFit": 1-10
  }
}`;
}

export function buildAgentAnalysisEnvelope(
  label: string,
  focusPoints: string[],
  input: GenerateIdeasInput,
) {
  return `You are acting as the ${label} agent.

${buildGenerateIdeasPrompt(input)}

Focus on:
${focusPoints.map((point) => `- ${point}`).join("\n")}

Return JSON only with this shape:
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "ideas": [
    {
      "title": "string",
      "angle": "string",
      "notes": ["string"]
    }
  ]
}`;
}

export function buildFinalEditorSynthesisPrompt(
  input: GenerateIdeasInput,
  agentOutputs: Record<string, string>,
) {
  return `${buildGenerateIdeasPrompt(input)}

Agent outputs:

Dreamer:
${agentOutputs.dreamer}

Builder:
${agentOutputs.builder}

Investor:
${agentOutputs.investor}

Critic:
${agentOutputs.critic}

Use these agent outputs to synthesize the final ideas.

Rules:
- keep only realistic, monetizable, non-generic ideas
- remove duplicates
- prefer ideas the workspace owner can validate quickly
- include criticism and execution risk in the final scoring
- return JSON only

Return this exact top-level shape:
{
  "ideas": [
    {
      "title": "string",
      "shortDescription": "string",
      "fullDescription": "string",
      "category": "string",
      "targetAudience": "string",
      "problem": "string",
      "solution": "string",
      "monetization": ["string"],
      "mvpFeatures": ["string"],
      "risks": ["string"],
      "firstSteps": ["string"],
      "scores": {
        "overall": 1-10,
        "market": 1-10,
        "feasibility": 1-10,
        "monetization": 1-10,
        "personalFit": 1-10
      }
    }
  ]
}`;
}
