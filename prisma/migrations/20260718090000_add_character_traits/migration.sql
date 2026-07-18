-- AlterTable
ALTER TABLE "Character" ADD COLUMN "traits" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
