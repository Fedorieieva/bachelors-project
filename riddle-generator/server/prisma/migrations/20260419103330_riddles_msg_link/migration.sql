-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "saved_riddle_id" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_saved_riddle_id_fkey" FOREIGN KEY ("saved_riddle_id") REFERENCES "riddles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
