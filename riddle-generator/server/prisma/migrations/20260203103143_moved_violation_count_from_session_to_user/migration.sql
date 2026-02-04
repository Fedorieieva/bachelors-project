/*
  Warnings:

  - You are about to drop the column `banned_until` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `last_violation_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `violation_count` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "banned_until",
DROP COLUMN "last_violation_at",
DROP COLUMN "violation_count";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banned_until" TIMESTAMP(3),
ADD COLUMN     "last_violation_at" TIMESTAMP(3),
ADD COLUMN     "violation_count" INTEGER NOT NULL DEFAULT 0;
