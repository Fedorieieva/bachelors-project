-- CreateTable
CREATE TABLE "saved_riddles" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "riddle_id" TEXT NOT NULL,

    CONSTRAINT "saved_riddles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_riddles_user_id_riddle_id_key" ON "saved_riddles"("user_id", "riddle_id");

-- AddForeignKey
ALTER TABLE "saved_riddles" ADD CONSTRAINT "saved_riddles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_riddles" ADD CONSTRAINT "saved_riddles_riddle_id_fkey" FOREIGN KEY ("riddle_id") REFERENCES "riddles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
