/*
  Warnings:

  - You are about to drop the column `order_time` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `starting_time` on the `Ride` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "order_time",
DROP COLUMN "starting_time",
ADD COLUMN     "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "starting_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
