-- CreateTable
CREATE TABLE "CreatorReference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "dataUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorReference_userId_characterId_idx" ON "CreatorReference"("userId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorReference_characterId_slot_key" ON "CreatorReference"("characterId", "slot");

-- AddForeignKey
ALTER TABLE "CreatorReference" ADD CONSTRAINT "CreatorReference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorReference" ADD CONSTRAINT "CreatorReference_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
