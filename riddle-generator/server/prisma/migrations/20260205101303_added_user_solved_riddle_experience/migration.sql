-- AlterTable
ALTER TABLE "users" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "riddles_solved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "solved_riddles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_preview" TEXT NOT NULL,
    "xp_earned" INTEGER NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solved_riddles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "solved_riddles" ADD CONSTRAINT "solved_riddles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
