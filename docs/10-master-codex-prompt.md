# Master Prompt for Codex — Ideas Generator MVP

You are a senior fullstack developer and software architect.

Help me build an MVP for a project called Ideas Generator.

The project is a private AI-powered business idea lab. It helps users generate, evaluate, refine, and store money-making ideas based on their personal workspace settings: skills, goals, constraints, interests, preferred markets, business models, budget, risk level, and additional context.

The app should be built as a private-first tool, not a public SaaS yet.

Important:

Do not try to build everything at once.

Work step by step:

1. Database schema.
2. Workspace auth flow.
3. Basic protected pages.
4. Workspace settings.
5. Idea storage.
6. Idea list/detail pages.
7. AI provider abstraction.
8. AI generation.
9. Refinement/MVP concept.
10. Usage tracking.

Use clean, production-oriented code.

Prefer simple, maintainable architecture over overengineering.

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- bcrypt for password hashing
- httpOnly cookies for sessions
- OpenRouter as first AI provider

## Core Product Idea

Ideas Generator is a private AI-powered business idea lab.

It allows a user to:

1. Create a private workspace.
2. Log into that workspace using workspace name + password.
3. Fill in workspace/generation settings.
4. Generate business/money-making ideas using AI.
5. Store all generated ideas in the database.
6. View ideas as cards in a list.
7. Open an idea detail page.
8. Refine an idea.
9. Generate an MVP concept from an idea.
10. Track AI token usage and estimated cost.

## Workspace Access

Do not implement classic user registration with email.

Instead, implement workspace-based access.

A Workspace is both:

- a private login space
- a generation context for AI prompts

Login page:

- Must NOT display existing workspaces.
- It should only show workspace name input and password input.
- It should have a link to create workspace.

Login page text:

```txt
Ideas Generator
Enter your private idea workspace
```

Authentication rules:

- Check whether workspace name exists.
- Compare password with passwordHash using bcrypt.
- If invalid, show only:
  `Invalid workspace name or password`
- Do not reveal whether the workspace exists.

After successful login:

- Set a secure httpOnly cookie.
- Store only workspaceId in the session/token.
- Protect all app routes.
- Every database query must be scoped by current workspaceId.

Public routes:

- `/login`
- `/create-workspace`

Protected routes:

- `/dashboard`
- `/profile`
- `/generate`
- `/ideas`
- `/ideas/[id]`
- `/usage`

Create workspace:

- Accessible without login.
- Requires workspace name, password, confirm password, and creation code.
- Creation code must be checked against env variable:
  `PROFILE_CREATION_CODE`
- After successful workspace creation:
  - hash password
  - create workspace
  - log user in automatically
  - redirect to `/profile`

## Main Models

Use Prisma models:

- Workspace
- Idea
- IdeaVersion
- AiUsageLog

Every Idea belongs to Workspace through workspaceId.

Every IdeaVersion belongs to Idea.

Every AiUsageLog belongs to Workspace and can optionally belong to Idea and IdeaVersion.

Do not create separate tables per workspace.

## Workspace Settings

Workspace settings should include:

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
- monthly budget USD

For MVP, array-like fields can be stored as PostgreSQL arrays or JSON.  
In the UI, use comma-separated textareas.

## Pages

Implement:

- `/login`
- `/create-workspace`
- `/dashboard`
- `/profile`
- `/generate`
- `/ideas`
- `/ideas/[id]`
- `/usage`

## AI Architecture

Create a clean AI layer:

```txt
/lib/ai
  /providers
    openrouterProvider.ts
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

For MVP, start with OpenRouter.

Use env variable:

```env
OPENROUTER_API_KEY=
```

Do not expose API keys to the client.

## AI Depth Modes

Implement:

- Draft
- Smart
- Deep

Draft:

- cheaper/faster
- fewer agents
- rough idea generation

Smart:

- balanced
- normal generation

Deep:

- stronger/more expensive
- refinement
- MVP concept
- reality check

## Generated Idea Format

Normalize AI output into:

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

Require JSON-only output from AI when generating ideas.

Validate and parse safely.

If parsing fails, handle gracefully and do not crash.

## Token and Cost Tracking

Every AI request should create an AiUsageLog.

Track:

- workspaceId
- ideaId if available
- ideaVersionId if available
- operationType
- agentName
- provider
- model
- promptTokens
- completionTokens
- totalTokens
- estimatedCostUsd
- providerRequestId if available
- status
- errorMessage if failed

If provider returns token usage, save it.

If provider returns cost, save it.

If provider does not return cost, estimate it if possible.

If exact calculation is not ready, estimatedCostUsd can be nullable.

## Idea Versioning

Do not overwrite ideas during refinement.

When user refines an idea, generates an MVP concept, or runs a reality check:

- create a new IdeaVersion
- increment versionNumber
- set type:
  - REFINED
  - MVP_CONCEPT
  - REALITY_CHECK
  - ROADMAP

The original idea remains available in version history.

## UI Direction

Use:

- clean modern dark interface
- private AI lab feeling
- cards
- soft borders
- rounded corners
- clear hierarchy
- simple forms
- readable typography

Use shadcn/ui components where useful.

## Do Not Implement Yet

Do not implement:

- public user registration with email
- OAuth
- payment system
- subscriptions
- Google Sheets integration
- team collaboration
- public profiles
- marketplace
- advanced admin panel
- full competitor scraping
- automatic web research
- PDF export
- complex role-based permissions

## Final Goal

Build a working MVP that allows me to privately generate, store, refine, and evaluate money-making ideas using AI, while keeping each workspace private and tracking token/cost usage.
