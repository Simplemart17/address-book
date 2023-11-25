/*
  Warnings:

  - A unique constraint covering the columns `[verification_code]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "verification_verification_code_key" ON "verification"("verification_code");
