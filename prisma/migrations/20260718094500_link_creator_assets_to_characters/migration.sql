-- AlterTable
ALTER TABLE "CreatorAsset" ADD COLUMN "characterId" TEXT;

-- Backfill existing creator assets to each creator's most recently updated draft.
UPDATE "CreatorAsset" AS asset
SET "characterId" = (
  SELECT character."id"
  FROM "Character" AS character
  WHERE character."creatorId" = asset."userId"
    AND character."isPublished" = false
  ORDER BY character."updatedAt" DESC
  LIMIT 1
);

-- ReplaceIndex
DROP INDEX "CreatorAsset_userId_createdAt_idx";
CREATE INDEX "CreatorAsset_userId_characterId_createdAt_idx"
ON "CreatorAsset"("userId", "characterId", "createdAt");

-- AddForeignKey
ALTER TABLE "CreatorAsset" ADD CONSTRAINT "CreatorAsset_characterId_fkey"
FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
