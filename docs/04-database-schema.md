# Ideas Generator — Database Schema

Use Prisma with PostgreSQL.

If PostgreSQL array fields cause issues in the current setup, use Json fields instead of `String[]`.

## Prisma Schema Draft

```prisma
model Workspace {
  id                      String   @id @default(cuid())
  name                    String   @unique
  passwordHash            String

  description             String?
  skills                  String[]
  interests               String[]
  goals                   String[]
  constraints             String[]
  preferredMarkets        String[]
  preferredBusinessModels String[]
  budgetLevel             BudgetLevel?
  riskLevel               RiskLevel?
  availableTime           String?
  additionalContext       String?

  monthlyBudgetUsd        Float?

  ideas                   Idea[]
  aiUsageLogs             AiUsageLog[]

  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}

model Idea {
  id                String   @id @default(cuid())
  workspaceId       String
  workspace         Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  title             String
  shortDescription  String
  category          String?

  status            IdeaStatus @default(NEW)

  currentVersionId  String?

  versions          IdeaVersion[]
  aiUsageLogs       AiUsageLog[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model IdeaVersion {
  id                String   @id @default(cuid())
  ideaId            String
  idea              Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)

  versionNumber     Int
  type              IdeaVersionType

  title             String
  shortDescription  String
  fullDescription   String?
  category          String?
  targetAudience    String?
  problem           String?
  solution          String?

  monetization      String[]
  mvpFeatures       String[]
  risks             String[]
  firstSteps        String[]

  overallScore      Float?
  marketScore       Float?
  feasibilityScore  Float?
  monetizationScore Float?
  personalFitScore  Float?

  rawAiResponse     Json?

  aiUsageLogs       AiUsageLog[]

  createdAt         DateTime @default(now())
}

model AiUsageLog {
  id                 String   @id @default(cuid())

  workspaceId        String
  workspace          Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  ideaId             String?
  idea               Idea?    @relation(fields: [ideaId], references: [id], onDelete: SetNull)

  ideaVersionId      String?
  ideaVersion        IdeaVersion? @relation(fields: [ideaVersionId], references: [id], onDelete: SetNull)

  operationType      AiOperationType
  agentName          String?

  provider           String
  model              String

  promptTokens       Int?
  completionTokens   Int?
  totalTokens        Int?

  estimatedCostUsd   Float?
  providerRequestId  String?

  status             AiRequestStatus
  errorMessage        String?

  createdAt          DateTime @default(now())
}

enum BudgetLevel {
  LOW
  MEDIUM
  HIGH
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
}

enum IdeaStatus {
  NEW
  INTERESTING
  RESEARCHING
  VALIDATING
  BUILDING
  PAUSED
  DONE
  REJECTED
}

enum IdeaVersionType {
  INITIAL
  REFINED
  REALITY_CHECK
  MVP_CONCEPT
  ROADMAP
  COMBINED
}

enum AiOperationType {
  GENERATE_IDEAS
  REFINE_IDEA
  REALITY_CHECK
  MVP_CONCEPT
  ROADMAP
  COMBINE_IDEAS
  MARKET_RESEARCH
  FINAL_RANKING
}

enum AiRequestStatus {
  SUCCESS
  FAILED
}
```

## Important Data Rules

Every idea belongs to one workspace.

Every query for ideas must be scoped by current workspaceId.

Example:

```ts
const ideas = await prisma.idea.findMany({
  where: {
    workspaceId: currentWorkspaceId,
  },
});
```

Do not create separate tables per workspace.

Use one shared `Idea` table with `workspaceId`.

## Idea Versioning

Do not overwrite ideas during refinement.

When the user refines an idea, generates an MVP concept, or runs a reality check:

- create a new IdeaVersion
- increment versionNumber
- set type:
  - REFINED
  - MVP_CONCEPT
  - REALITY_CHECK
  - ROADMAP

The original idea remains available in version history.
