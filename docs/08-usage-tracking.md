# Ideas Generator — AI Usage and Cost Tracking

## Goal

The app must track AI token usage and estimated cost.

This is important because the project may use several AI agents and several AI models with different prices.

The user should understand:

- how many tokens were spent
- which agent spent them
- which model was used
- how much the operation cost
- how much was spent today/month
- whether deep mode is becoming too expensive

## Usage Log

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

## Operation Types

- GENERATE_IDEAS
- REFINE_IDEA
- REALITY_CHECK
- MVP_CONCEPT
- ROADMAP
- COMBINE_IDEAS
- MARKET_RESEARCH
- FINAL_RANKING

## Statuses

- SUCCESS
- FAILED

## Cost Calculation

If provider returns usage data, save it.

If provider returns cost, save it.

If provider does not return cost, estimate cost based on model config if available.

Formula:

```txt
cost =
(promptTokens / 1_000_000 * inputPricePer1M)
+
(completionTokens / 1_000_000 * outputPricePer1M)
```

For MVP, do not block development if exact cost calculation is not ready.

At minimum:

- save token usage when available
- save estimatedCostUsd as nullable

## Usage Page

Route:

```txt
/usage
```

Show usage for current workspace only.

Show:

- total tokens today
- total tokens this month
- estimated cost today
- estimated cost this month
- requests by operation type
- usage by agent
- usage by model/provider

## Dashboard Usage Summary

On dashboard, show simple current month summary:

- total tokens
- estimated cost
- number of AI requests

## Idea Detail Usage

On idea detail page, show token/cost usage for this idea.

Example:

```txt
AI usage

Initial generation:
Dreamer — 1,240 tokens — $0.0008
Builder — 980 tokens — $0.0006
Critic — 1,500 tokens — $0.0011
Final Editor — 2,300 tokens — $0.004

Total:
6,020 tokens
Estimated cost: $0.0065
```

## Budget Limits

Workspace can have:

- monthlyBudgetUsd

In MVP:

- show warning if estimated monthly usage is close to budget
- do not necessarily block generation yet

Later:

- block Deep Mode if budget is exceeded
- add daily/monthly token limits
