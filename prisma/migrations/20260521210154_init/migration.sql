-- CreateEnum
CREATE TYPE "BudgetLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('NEW', 'INTERESTING', 'RESEARCHING', 'VALIDATING', 'BUILDING', 'PAUSED', 'DONE', 'REJECTED');

-- CreateEnum
CREATE TYPE "IdeaVersionType" AS ENUM ('INITIAL', 'REFINED', 'REALITY_CHECK', 'MVP_CONCEPT', 'ROADMAP', 'COMBINED');

-- CreateEnum
CREATE TYPE "AiOperationType" AS ENUM ('GENERATE_IDEAS', 'REFINE_IDEA', 'REALITY_CHECK', 'MVP_CONCEPT', 'ROADMAP', 'COMBINE_IDEAS', 'MARKET_RESEARCH', 'FINAL_RANKING');

-- CreateEnum
CREATE TYPE "AiRequestStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "description" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "goals" TEXT[],
    "constraints" TEXT[],
    "preferredMarkets" TEXT[],
    "preferredBusinessModels" TEXT[],
    "budgetLevel" "BudgetLevel",
    "riskLevel" "RiskLevel",
    "availableTime" TEXT,
    "additionalContext" TEXT,
    "monthlyBudgetUsd" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "category" TEXT,
    "status" "IdeaStatus" NOT NULL DEFAULT 'NEW',
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaVersion" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "type" "IdeaVersionType" NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "category" TEXT,
    "targetAudience" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "monetization" TEXT[],
    "mvpFeatures" TEXT[],
    "risks" TEXT[],
    "firstSteps" TEXT[],
    "overallScore" DOUBLE PRECISION,
    "marketScore" DOUBLE PRECISION,
    "feasibilityScore" DOUBLE PRECISION,
    "monetizationScore" DOUBLE PRECISION,
    "personalFitScore" DOUBLE PRECISION,
    "rawAiResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsageLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "ideaId" TEXT,
    "ideaVersionId" TEXT,
    "operationType" "AiOperationType" NOT NULL,
    "agentName" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "estimatedCostUsd" DOUBLE PRECISION,
    "providerRequestId" TEXT,
    "status" "AiRequestStatus" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_key" ON "Workspace"("name");

-- CreateIndex
CREATE INDEX "Idea_workspaceId_createdAt_idx" ON "Idea"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Idea_workspaceId_status_idx" ON "Idea"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "IdeaVersion_ideaId_createdAt_idx" ON "IdeaVersion"("ideaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaVersion_ideaId_versionNumber_key" ON "IdeaVersion"("ideaId", "versionNumber");

-- CreateIndex
CREATE INDEX "AiUsageLog_workspaceId_createdAt_idx" ON "AiUsageLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsageLog_ideaId_idx" ON "AiUsageLog"("ideaId");

-- CreateIndex
CREATE INDEX "AiUsageLog_ideaVersionId_idx" ON "AiUsageLog"("ideaVersionId");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "IdeaVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaVersion" ADD CONSTRAINT "IdeaVersion_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageLog" ADD CONSTRAINT "AiUsageLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageLog" ADD CONSTRAINT "AiUsageLog_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageLog" ADD CONSTRAINT "AiUsageLog_ideaVersionId_fkey" FOREIGN KEY ("ideaVersionId") REFERENCES "IdeaVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
