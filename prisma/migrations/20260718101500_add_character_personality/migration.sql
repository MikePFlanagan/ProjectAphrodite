-- AlterTable
ALTER TABLE "Character" ADD COLUMN "personality" JSONB NOT NULL DEFAULT '{}';

-- Backfill existing characters with the Creator Studio personality defaults.
UPDATE "Character"
SET "personality" = '{
  "warmth": 75,
  "humor": 50,
  "confidence": 60,
  "curiosity": 80,
  "emotionalExpressiveness": 70,
  "responseLength": "balanced",
  "conversationStyle": "supportive",
  "instructions": ""
}'::jsonb
WHERE "personality" = '{}'::jsonb;
