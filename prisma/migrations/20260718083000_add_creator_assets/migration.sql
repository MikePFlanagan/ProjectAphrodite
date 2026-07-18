-- CreateTable
CREATE TABLE "CreatorAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "promptValues" JSONB NOT NULL,
    "locks" JSONB NOT NULL,
    "variation" INTEGER NOT NULL,
    "palette" JSONB NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorAsset_userId_createdAt_idx" ON "CreatorAsset"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "CreatorAsset" ADD CONSTRAINT "CreatorAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
