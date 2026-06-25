import type {
  GenerateIdeasInput,
  GenerateMvpConceptInput,
  IdeaContext,
  RealityCheckInput,
  RefineIdeaInput,
  WorkspaceContext,
} from "@/lib/ai/types";

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

function formatIdeaContext(idea: IdeaContext) {
  return `Title: ${idea.title}
Short description: ${idea.shortDescription}
Full description: ${formatOptional(idea.fullDescription)}
Category: ${formatOptional(idea.category)}
Target audience: ${formatOptional(idea.targetAudience)}
Problem: ${formatOptional(idea.problem)}
Solution: ${formatOptional(idea.solution)}
Monetization: ${formatList(idea.monetization)}
MVP features: ${formatList(idea.mvpFeatures)}
Risks: ${formatList(idea.risks)}
First steps: ${formatList(idea.firstSteps)}
Scores:
- overall: ${idea.scores.overall}
- market: ${idea.scores.market}
- feasibility: ${idea.scores.feasibility}
- monetization: ${idea.scores.monetization}
- personalFit: ${idea.scores.personalFit}`;
}

export function getBaseSystemPrompt() {
  return BASE_SYSTEM_PROMPT;
}

export function buildGenerateIdeasPrompt(input: GenerateIdeasInput) {
  const hasCategory = Boolean(input.category?.trim());
  const hasCustomPrompt = Boolean(input.customPrompt?.trim());
  const fallbackRequest =
    "Generate practical low-budget business ideas with clear monetization, fast validation potential, and room for either offline, online, or hybrid execution.";

  return `Generate ${input.numberOfIdeas} money-making ideas for this workspace.

Workspace context:
${buildWorkspaceContextBlock(input.workspace)}

Generation settings:
Idea type/category: ${input.category?.trim() || "Not specified"}
Market focus: ${input.marketFocus}
AI depth: ${input.depth}
Custom request: ${input.customPrompt?.trim() || "Not specified"}
Fallback request when optional fields are blank: ${
    !hasCategory && !hasCustomPrompt ? fallbackRequest : "Not needed"
  }

If both "Idea type/category" and "Custom request" are not specified, use this fallback direction:
${fallbackRequest}

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

export function buildRefineIdeaPrompt(input: RefineIdeaInput) {
  return `Refine this business idea and make it more realistic, specific, and useful.

Workspace context:
${buildWorkspaceContextBlock(input.workspace)}

Current idea:
${formatIdeaContext(input.idea)}

User refinement request:
${input.customPrompt?.trim() || "Not specified"}

Focus on:
- clearer target audience
- sharper problem
- more realistic MVP
- faster validation
- better monetization
- risks and weak points
- first steps for the next 7 days

Return JSON only using this exact shape:
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

export function buildMvpConceptPrompt(input: GenerateMvpConceptInput) {
  return `Turn this idea into a practical MVP concept.

Workspace context:
${buildWorkspaceContextBlock(input.workspace)}

Idea:
${formatIdeaContext(input.idea)}

Additional MVP request:
${input.customPrompt?.trim() || "Not specified"}

Create a detailed MVP concept with:
- sharper target audience
- stronger value proposition
- practical MVP feature list
- validation-first scope
- development roadmap
- realistic monetization
- first 7 days action plan

Return JSON only using this exact shape:
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

export function buildRealityCheckPrompt(input: RealityCheckInput) {
  return `Perform a harsh but constructive reality check for this idea.

Workspace context:
${buildWorkspaceContextBlock(input.workspace)}

Idea:
${formatIdeaContext(input.idea)}

Additional instructions:
${input.customPrompt?.trim() || "Not specified"}

Analyze:
- why this idea may fail
- whether people would really pay for it
- possible competitors or substitutes
- biggest assumptions
- hardest part of execution
- cheapest validation test
- signs that the idea should be killed
- signs that the idea is worth continuing
- how to simplify the idea

Be direct and practical.

Return JSON only using this exact shape:
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

export function buildDreamerCandidateEnvelope(input: GenerateIdeasInput) {
  const hasCategory = Boolean(input.category?.trim());
  const hasCustomPrompt = Boolean(input.customPrompt?.trim());
  const fallbackRequest =
    "Practical low-budget business ideas with clear monetization, fast validation potential, and room for offline, online, or hybrid execution.";

  return `You are Dreamer, the first agent in a startup idea pipeline.

Your job is to propose concise candidate ideas for later review by Builder, Investor, and Critic.

Rules:
- return only JSON
- do not include hidden reasoning, step-by-step thinking, or explanations
- do not write long analysis
- do not repeat the same idea in summary and ideas
- summary must be 1 short sentence about the overall direction, not a list of ideas
- each idea angle must be 1 concise sentence
- notes must be practical, short, and non-repetitive

Context:
- Workspace: ${input.workspace.name}
- Category: ${input.category?.trim() || "Not specified"}
- Market focus: ${input.marketFocus}
- Depth: ${input.depth}
- Custom request: ${input.customPrompt?.trim() || "Not specified"}
- Fallback direction: ${
    !hasCategory && !hasCustomPrompt ? fallbackRequest : "Not needed"
  }

Workspace profile:
${buildWorkspaceContextBlock(input.workspace)}

Generate exactly ${input.numberOfIdeas} candidate ideas.

Return JSON only with this shape:
{
  "summary": "string",
  "ideas": [
    {
      "title": "string",
      "angle": "string",
      "notes": ["string"]
    }
  ]
}`;
}

export function buildBuilderReviewEnvelope(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  const candidateIdeasBlock = candidateIdeas?.trim()
    ? candidateIdeas.trim()
    : "No Dreamer candidates were provided. Review the workspace request directly.";

  return `You are Builder, a practical MVP feasibility reviewer.

Your job is to turn Dreamer candidate ideas into concise buildability notes.

Rules:
- return only JSON
- do not include hidden reasoning, step-by-step thinking, or explanations
- do not describe your thought process
- do not restate the assignment
- do not copy Dreamer text verbatim
- do not repeat the same execution point in summary, angle, and notes
- summary must be 1 short sentence about the overall buildability pattern
- each angle must be 1 concise feasibility verdict
- notes must be short, practical, and non-repetitive
- focus on MVP scope, manual-first validation, technical complexity, operational drag, and fastest shippable version

Workspace profile:
${buildWorkspaceContextBlock(input.workspace)}

Candidate ideas from Dreamer:
${candidateIdeasBlock}

Return exactly ${input.numberOfIdeas} reviewed idea notes.

Return JSON only with this shape:
{
  "summary": "string",
  "ideas": [
    {
      "title": "string",
      "angle": "string",
      "notes": ["string"]
    }
  ]
}`;
}

export function buildInvestorReviewEnvelope(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  const candidateIdeasBlock = candidateIdeas?.trim()
    ? candidateIdeas.trim()
    : "No Dreamer candidates were provided. Review the workspace request directly.";

  return `You are Investor, a revenue and first-customer reviewer.

Your job is to turn Dreamer candidate ideas into concise monetization notes.

Rules:
- return only JSON
- do not include hidden reasoning, step-by-step thinking, or explanations
- do not describe your thought process
- do not restate the assignment
- do not copy Dreamer text verbatim
- do not repeat the same monetization point in summary, angle, and notes
- summary must be 1 short sentence about the overall revenue pattern
- each angle must be 1 concise commercial verdict
- notes must be short, practical, and non-repetitive
- focus on willingness to pay, pricing, first customers, sales channel, payback speed, and realistic earning potential

Workspace profile:
${buildWorkspaceContextBlock(input.workspace)}

Candidate ideas from Dreamer:
${candidateIdeasBlock}

Return exactly ${input.numberOfIdeas} reviewed idea notes.

Return JSON only with this shape:
{
  "summary": "string",
  "ideas": [
    {
      "title": "string",
      "angle": "string",
      "notes": ["string"]
    }
  ]
}`;
}

export function buildCriticReviewEnvelope(
  input: GenerateIdeasInput,
  candidateIdeas?: string,
) {
  const candidateIdeasBlock = candidateIdeas?.trim()
    ? candidateIdeas.trim()
    : "No Dreamer candidates were provided. Review the workspace request directly.";

  return `You are Critic, a startup idea risk reviewer.

Your job is to give concise risk verdicts for Dreamer candidate ideas.

Rules:
- return only JSON
- do not include hidden reasoning, step-by-step thinking, or explanations
- do not describe your thought process
- do not restate the assignment
- do not copy Dreamer text verbatim
- do not repeat the same risk in summary, angle, and notes
- summary must be 1 short sentence about the overall risk pattern, not a list of ideas
- each angle must be 1 concise risk verdict
- notes must be short, practical, and non-repetitive
- focus on kill risks, validation traps, competition, demand, and execution fragility

Workspace profile:
${buildWorkspaceContextBlock(input.workspace)}

Candidate ideas from Dreamer:
${candidateIdeasBlock}

Return exactly ${input.numberOfIdeas} reviewed idea notes.

Return JSON only with this shape:
{
  "summary": "string",
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
- use double-quoted JSON property names only
- do not use markdown fences
- do not add comments or trailing commas

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
