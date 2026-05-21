# Ideas Generator — MVP Scope

## Implement in MVP

### Workspace and Access

- Workspace creation with creation code.
- Workspace login by workspace name and password.
- Protected routes by workspace session.
- Each workspace sees only its own data.
- No visible workspace list on login page.

### Workspace Settings

Workspace/generation settings form with:

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

For MVP, array-like fields can be simple textareas with comma-separated values.

### Main Pages

- `/login`
- `/create-workspace`
- `/dashboard`
- `/profile`
- `/generate`
- `/ideas`
- `/ideas/[id]`
- `/usage`

### Ideas

- Generate ideas.
- Store generated ideas automatically in the database.
- Show ideas as cards in a list.
- Open idea detail page.
- Change idea status.
- Store version history.
- Refine idea.
- Generate MVP concept.
- Run Reality Check.
- Generate roadmap later if time allows.

### AI

- Start with one AI provider abstraction.
- Prefer OpenRouter for MVP because it can route to multiple models later.
- Keep provider logic server-side.
- Never expose API keys to client components.
- Support AI depth modes:
  - Draft
  - Smart
  - Deep

### Usage Tracking

Create usage logs for AI requests.

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

### Dashboard

Show:

- workspace name
- quick actions
- recent ideas
- current month usage summary:
  - total tokens
  - estimated cost
  - number of AI requests

## Do Not Implement in MVP

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

## Future Ideas

Possible later features:

- combine 2–3 ideas into one stronger concept
- export idea as Markdown
- export idea as PDF
- generate Codex prompt from selected idea
- advanced usage analytics
- model comparison
- workspace privacy settings
- real user accounts
- subscription/payment system
- team workspaces
- public idea templates
