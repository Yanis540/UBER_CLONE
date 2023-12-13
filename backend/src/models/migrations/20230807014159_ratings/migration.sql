/*
  Warnings:

  - You are about to drop the column `driver_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,licence_id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licence_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_driver_id_fkey";

-- DropIndex
DROP INDEX "Comment_user_id_driver_id_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "driver_id",
DROP COLUMN "rating",
ADD COLUMN     "licence_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Rating" (
    "licence_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("licence_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_user_id_licence_id_key" ON "Comment"("user_id", "licence_id");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_licence_id_fkey" FOREIGN KEY ("licence_id") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_licence_id_fkey" FOREIGN KEY ("licence_id") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;
