-- CreateEnum
CREATE TYPE "RiddleType" AS ENUM ('DANETKI', 'CLASSIC', 'LOGIC', 'MATH');

-- AlterTable
ALTER TABLE "riddles" ADD COLUMN     "complexity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "RiddleType" NOT NULL DEFAULT 'CLASSIC';
