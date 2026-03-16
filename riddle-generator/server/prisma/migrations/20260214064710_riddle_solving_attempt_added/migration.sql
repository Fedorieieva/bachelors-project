-- CreateTable
CREATE TABLE "RiddleAttempt" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "riddle_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_try" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RiddleAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiddleAttempt_user_id_riddle_id_key" ON "RiddleAttempt"("user_id", "riddle_id");

-- AddForeignKey
ALTER TABLE "RiddleAttempt" ADD CONSTRAINT "RiddleAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleAttempt" ADD CONSTRAINT "RiddleAttempt_riddle_id_fkey" FOREIGN KEY ("riddle_id") REFERENCES "riddles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
