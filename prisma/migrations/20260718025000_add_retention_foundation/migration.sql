ALTER TABLE "Conversation"
ADD COLUMN "summary" TEXT,
ADD COLUMN "summaryUpdatedAt" TIMESTAMP(3);

WITH ranked_memories AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "userId", "characterId", "key"
      ORDER BY "updatedAt" DESC, "importance" DESC, "id" DESC
    ) AS "duplicateRank"
  FROM "Memory"
)
DELETE FROM "Memory"
USING ranked_memories
WHERE "Memory"."id" = ranked_memories."id"
  AND ranked_memories."duplicateRank" > 1;

CREATE UNIQUE INDEX "Memory_userId_characterId_key_key"
ON "Memory"("userId", "characterId", "key");

CREATE INDEX "Memory_userId_characterId_importance_updatedAt_idx"
ON "Memory"("userId", "characterId", "importance", "updatedAt");

DROP INDEX "Memory_userId_characterId_idx";
