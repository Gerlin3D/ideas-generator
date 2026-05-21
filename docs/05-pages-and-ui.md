# Ideas Generator — Pages and UI

## Style Direction

Use a clean modern UI.

Preferred direction:

- dark elegant interface
- private AI lab feeling
- cards
- soft borders
- rounded corners
- clear hierarchy
- simple forms
- readable typography

Use shadcn/ui components where useful:

- Button
- Card
- Input
- Textarea
- Select
- Badge
- Tabs
- Table
- Dialog

## Routes

### `/login`

Private login page.

Do not show list of workspaces.

Fields:

- workspace name
- password

Actions:

- login
- link to create workspace

Suggested copy:

```txt
Ideas Generator
Enter your private idea workspace
```

### `/create-workspace`

Create new private workspace.

Fields:

- workspace name
- password
- confirm password
- creation code

After success:

- create workspace
- login automatically
- redirect to `/profile`

### `/dashboard`

Protected dashboard.

Show:

- workspace name
- quick actions:
  - Generate Ideas
  - View Ideas
  - Edit Profile
  - Usage Stats

Show:

- recent ideas
- usage summary for current month:
  - total tokens
  - estimated cost
  - number of AI requests

### `/profile`

Workspace/generation settings page.

Fields:

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

For array-like fields, use textarea with comma-separated values in MVP.

Convert comma-separated values to arrays on save.

### `/generate`

Idea generation page.

Fields:

- number of ideas: 1-10
- idea type/category
- market focus: RU / Global / Both
- AI depth: Draft / Smart / Deep
- optional custom prompt/context

Button:

- Generate ideas

Generation must always use current workspace data.

Generated ideas must be automatically saved to DB.

### `/ideas`

List of ideas for current workspace only.

Show cards:

- title
- short description
- category
- overall score
- status
- created date

Actions:

- open
- refine
- make MVP concept
- change status

### `/ideas/[id]`

Idea detail page.

Show:

- current version
- title
- short description
- full description
- problem
- solution
- target audience
- monetization
- MVP features
- risks
- first steps
- scores
- version history
- token/cost usage for this idea

Actions:

- Refine idea
- Generate MVP concept
- Reality Check
- Generate roadmap
- Change status

### `/usage`

Usage statistics page.

Show for current workspace only:

- total tokens today
- total tokens this month
- estimated cost today
- estimated cost this month
- requests by operation type
- usage by agent
- usage by model/provider
