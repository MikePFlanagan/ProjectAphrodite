-- CreateEnum
CREATE TYPE "ContentReferenceSource" AS ENUM ('UPLOAD', 'URL', 'MANUAL');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "GenerationJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ContentPlanItemStatus" AS ENUM ('IDEA', 'DRAFT', 'READY_FOR_GENERATION', 'GENERATING', 'READY_FOR_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'FAILED');

-- CreateTable
CREATE TABLE "ContentReference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "sourceType" "ContentReferenceSource" NOT NULL,
    "sourceUrl" TEXT,
    "platform" TEXT,
    "title" TEXT,
    "description" TEXT,
    "mediaUrl" TEXT,
    "mediaMimeType" TEXT,
    "duration" DOUBLE PRECISION,
    "creatorName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "views" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "saves" INTEGER,
    "followersAtPublish" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "referenceId" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "hook" JSONB NOT NULL DEFAULT '{}',
    "pacing" JSONB NOT NULL DEFAULT '{}',
    "visualStructure" JSONB NOT NULL DEFAULT '{}',
    "narrative" JSONB NOT NULL DEFAULT '{}',
    "textStrategy" JSONB NOT NULL DEFAULT '{}',
    "audioStrategy" JSONB NOT NULL DEFAULT '{}',
    "engagement" JSONB NOT NULL DEFAULT '{}',
    "archetype" TEXT,
    "contentDna" JSONB NOT NULL DEFAULT '{}',
    "confidence" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentConcept" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "analysisId" TEXT,
    "experimentId" TEXT,
    "title" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "script" TEXT,
    "scenePlan" JSONB NOT NULL DEFAULT '[]',
    "shotList" JSONB NOT NULL DEFAULT '[]',
    "caption" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimatedDuration" DOUBLE PRECISION,
    "generationPrompt" TEXT,
    "negativePrompt" TEXT,
    "platform" TEXT,
    "objective" TEXT,
    "originalityNotes" TEXT,
    "borrowedElements" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentGenerationJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerJobId" TEXT,
    "status" "GenerationJobStatus" NOT NULL DEFAULT 'QUEUED',
    "request" JSONB NOT NULL DEFAULT '{}',
    "result" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentGenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "objectives" TEXT,
    "constraints" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlanItem" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "conceptId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "platform" TEXT,
    "archetype" TEXT,
    "hookSummary" TEXT,
    "status" "ContentPlanItemStatus" NOT NULL DEFAULT 'IDEA',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPerformance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "conceptId" TEXT,
    "platform" TEXT NOT NULL,
    "views" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "saves" INTEGER,
    "clicks" INTEGER,
    "followersGained" INTEGER,
    "revenue" DOUBLE PRECISION,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "sampleSize" INTEGER NOT NULL,
    "metric" TEXT NOT NULL,
    "baseline" DOUBLE PRECISION,
    "observed" DOUBLE PRECISION,
    "effect" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentExperiment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hypothesis" TEXT,
    "variable" TEXT NOT NULL,
    "variants" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentReference_userId_createdAt_idx" ON "ContentReference"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentReference_userId_characterId_idx" ON "ContentReference"("userId", "characterId");

-- CreateIndex
CREATE INDEX "ContentAnalysis_userId_createdAt_idx" ON "ContentAnalysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentAnalysis_referenceId_idx" ON "ContentAnalysis"("referenceId");

-- CreateIndex
CREATE INDEX "ContentConcept_userId_createdAt_idx" ON "ContentConcept"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentConcept_characterId_idx" ON "ContentConcept"("characterId");

-- CreateIndex
CREATE INDEX "ContentConcept_experimentId_idx" ON "ContentConcept"("experimentId");

-- CreateIndex
CREATE INDEX "ContentGenerationJob_userId_createdAt_idx" ON "ContentGenerationJob"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentGenerationJob_status_idx" ON "ContentGenerationJob"("status");

-- CreateIndex
CREATE INDEX "ContentGenerationJob_conceptId_idx" ON "ContentGenerationJob"("conceptId");

-- CreateIndex
CREATE INDEX "ContentPlan_userId_createdAt_idx" ON "ContentPlan"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentPlan_characterId_idx" ON "ContentPlan"("characterId");

-- CreateIndex
CREATE INDEX "ContentPlanItem_planId_scheduledAt_idx" ON "ContentPlanItem"("planId", "scheduledAt");

-- CreateIndex
CREATE INDEX "ContentPerformance_userId_characterId_measuredAt_idx" ON "ContentPerformance"("userId", "characterId", "measuredAt");

-- CreateIndex
CREATE INDEX "ContentPerformance_conceptId_idx" ON "ContentPerformance"("conceptId");

-- CreateIndex
CREATE INDEX "ContentInsight_userId_characterId_createdAt_idx" ON "ContentInsight"("userId", "characterId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentExperiment_userId_characterId_createdAt_idx" ON "ContentExperiment"("userId", "characterId", "createdAt");

-- AddForeignKey
ALTER TABLE "ContentReference" ADD CONSTRAINT "ContentReference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReference" ADD CONSTRAINT "ContentReference_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "ContentReference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentConcept" ADD CONSTRAINT "ContentConcept_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentConcept" ADD CONSTRAINT "ContentConcept_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentConcept" ADD CONSTRAINT "ContentConcept_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ContentAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentConcept" ADD CONSTRAINT "ContentConcept_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "ContentExperiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGenerationJob" ADD CONSTRAINT "ContentGenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGenerationJob" ADD CONSTRAINT "ContentGenerationJob_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGenerationJob" ADD CONSTRAINT "ContentGenerationJob_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ContentConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlan" ADD CONSTRAINT "ContentPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlan" ADD CONSTRAINT "ContentPlan_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlanItem" ADD CONSTRAINT "ContentPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ContentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlanItem" ADD CONSTRAINT "ContentPlanItem_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ContentConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformance" ADD CONSTRAINT "ContentPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformance" ADD CONSTRAINT "ContentPerformance_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformance" ADD CONSTRAINT "ContentPerformance_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ContentConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentInsight" ADD CONSTRAINT "ContentInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentInsight" ADD CONSTRAINT "ContentInsight_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentExperiment" ADD CONSTRAINT "ContentExperiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentExperiment" ADD CONSTRAINT "ContentExperiment_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
