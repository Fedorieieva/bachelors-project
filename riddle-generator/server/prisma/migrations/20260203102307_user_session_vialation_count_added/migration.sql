-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "banned_until" TIMESTAMP(3),
ADD COLUMN     "last_violation_at" TIMESTAMP(3),
ADD COLUMN     "violation_count" INTEGER NOT NULL DEFAULT 0;
