# Ideas Generator — Development Plan for Codex

## Main Instruction

Do not build everything at once.

Work step by step.

Prefer clean, maintainable code over overengineering.

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

## Step 1 — Project Setup and Prisma

Set up:

- Prisma schema
- database connection
- Workspace model
- Idea model
- IdeaVersion model
- AiUsageLog model
- enums

Run migration.

## Step 2 — Workspace Creation

Implement `/create-workspace`.

Requirements:

- workspace name
- password
- confirm password
- creation code
- check creation code against `PROFILE_CREATION_CODE`
- hash password with bcrypt
- create workspace
- log in automatically
- redirect to `/profile`

## Step 3 — Workspace Login

Implement `/login`.

Requirements:

- workspace name
- password
- no visible workspace list
- generic error only:
  `Invalid workspace name or password`
- compare password with passwordHash
- set secure httpOnly cookie
- store workspaceId in session/token

## Step 4 — Route Protection

Protect:

- `/dashboard`
- `/profile`
- `/generate`
- `/ideas`
- `/ideas/[id]`
- `/usage`

Every server query must be scoped by current workspaceId.

## Step 5 — Dashboard and Profile Settings

Implement:

- `/dashboard`
- `/profile`

Profile form fields:

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

Use comma-separated textareas for arrays in MVP.

## Step 6 — Ideas List and Detail with Mock/Manual Data

Implement:

- `/ideas`
- `/ideas/[id]`

Before AI integration, allow displaying stored ideas.

Show:

- idea cards
- status
- current version
- version history
- idea details

## Step 7 — AI Provider Abstraction

Create:

```txt
/lib/ai/providers/openrouterProvider.ts
/lib/ai/orchestrator.ts
/lib/ai/types.ts
/lib/ai/prompts.ts
/lib/ai/usage.ts
```

Use env:

```env
OPENROUTER_API_KEY=
```

Keep AI calls server-side.

## Step 8 — Generate Ideas Flow

Implement `/generate`.

Inputs:

- number of ideas: 1-10
- category/type
- market focus
- AI depth
- optional custom prompt

Generation must always include workspace context.

Save generated ideas automatically:

- create Idea
- create IdeaVersion with type INITIAL
- create AiUsageLog

## Step 9 — Refine Idea and MVP Concept

On idea detail page, implement actions:

- Refine idea
- Generate MVP concept
- Reality Check if time allows

Each action:

- calls AI
- creates new IdeaVersion
- creates AiUsageLog
- does not overwrite previous versions

## Step 10 — Usage Stats

Implement `/usage`.

Show:

- total tokens today
- total tokens this month
- estimated cost today
- estimated cost this month
- requests by operation
- usage by agent
- usage by model/provider

## Quality Rules

- Keep components simple.
- Validate server inputs.
- Handle AI JSON parsing errors gracefully.
- Never expose API keys to client.
- Never show data from another workspace.
- Do not implement public user registration in MVP.
- Do not implement payments.
- Do not implement Google Sheets.
