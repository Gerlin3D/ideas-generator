# Ideas Generator — AI Architecture

## AI Layer Structure

Create a clean AI layer:

```txt
/lib/ai
  /providers
    openrouterProvider.ts
    openaiProvider.ts optional
    geminiProvider.ts optional

  /agents
    dreamerAgent.ts
    builderAgent.ts
    investorAgent.ts
    criticAgent.ts
    finalEditorAgent.ts

  orchestrator.ts
  types.ts
  usage.ts
  prompts.ts
```

For MVP, start with one provider.

Prefer OpenRouter because it can route to many models later.

## Environment Variables

```env
OPENROUTER_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
PROFILE_CREATION_CODE=
SESSION_SECRET=
```

Do not hardcode API keys.

## AI Modes

Implement three AI depth modes:

### Draft

- cheaper/faster
- fewer agents
- used for rough idea generation

### Smart

- balanced
- several agents
- used for normal generation

### Deep

- more expensive
- stronger model
- used for MVP concept, refinement, reality check

For MVP, model names can be configured in one file.

Example:

```ts
const AI_MODELS = {
  draft: {
    provider: "openrouter",
    model: "some-cheap-model",
  },
  smart: {
    provider: "openrouter",
    model: "some-balanced-model",
  },
  deep: {
    provider: "openrouter",
    model: "some-strong-model",
  },
};
```

## Conceptual Agents

### Dreamer

Generates creative but still realistic money-making ideas.

Focuses on:

- opportunities
- niches
- combinations
- fresh concepts

### Builder

Evaluates technical feasibility.

Focuses on:

- MVP scope
- stack
- difficulty
- how fast the user can build it

### Investor

Evaluates monetization.

Focuses on:

- revenue models
- pricing
- first customers
- realistic earning paths

### Critic

Challenges the idea.

Finds:

- weak points
- competition
- risks
- reasons why the idea may fail

### Final Editor

Merges agent outputs into clean structured ideas.

Responsibilities:

- remove duplicates
- remove generic ideas
- rank ideas by overall potential
- return valid JSON

## Generated Idea Output Format

The AI generation result should be normalized into this structure:

```ts
type GeneratedIdea = {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  targetAudience?: string;
  problem?: string;
  solution?: string;
  monetization: string[];
  mvpFeatures: string[];
  risks: string[];
  firstSteps: string[];
  scores: {
    overall: number;
    market: number;
    feasibility: number;
    monetization: number;
    personalFit: number;
  };
};
```

Require AI to return JSON only when generating ideas.

Validate and parse responses safely.

If parsing fails, handle the error gracefully and do not crash the app.

## Prompt Requirements

Every generation prompt must include:

Current workspace context:

- name
- description
- skills
- interests
- goals
- constraints
- preferred markets
- preferred business models
- budget level
- risk level
- available time
- additional context

Generation settings:

- number of ideas
- category/type
- market focus
- AI depth
- custom prompt

The AI should prioritize ideas that are:

- realistic
- monetizable
- suitable for the workspace owner
- possible to validate quickly
- possible to start with low budget
- not too broad
- not generic
