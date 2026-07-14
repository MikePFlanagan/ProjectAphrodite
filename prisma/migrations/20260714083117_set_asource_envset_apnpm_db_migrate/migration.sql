/*
  Warnings:

  - A unique constraint covering the columns `[userId,characterId,key]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Memory_userId_characterId_key_key" ON "Memory"("userId", "characterId", "key");
