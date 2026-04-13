-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "complexity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'ukrainian',
ADD COLUMN     "type" "RiddleType" NOT NULL DEFAULT 'LOGIC';
