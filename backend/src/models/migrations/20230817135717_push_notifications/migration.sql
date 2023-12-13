/*
  Warnings:

  - A unique constraint covering the columns `[push_token_value]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "push_token_value" TEXT;

-- CreateTable
CREATE TABLE "PushNotificationToken" (
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushNotificationToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_push_token_value_key" ON "User"("push_token_value");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_push_token_value_fkey" FOREIGN KEY ("push_token_value") REFERENCES "PushNotificationToken"("token") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushNotificationToken" ADD CONSTRAINT "PushNotificationToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
