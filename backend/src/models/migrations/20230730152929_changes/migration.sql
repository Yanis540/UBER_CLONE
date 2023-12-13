/*
  Warnings:

  - You are about to drop the column `adr_address` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "adr_address";

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "accepted_at" TIMESTAMP(3),
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCancelledByDriver" BOOLEAN NOT NULL DEFAULT false;
