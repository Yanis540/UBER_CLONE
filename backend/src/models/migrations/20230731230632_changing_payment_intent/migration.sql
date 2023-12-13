/*
  Warnings:

  - A unique constraint covering the columns `[ride_id]` on the table `StripePaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "StripePaymentIntent" DROP CONSTRAINT "StripePaymentIntent_id_fkey";

-- AlterTable
ALTER TABLE "StripePaymentIntent" ADD COLUMN     "ride_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StripePaymentIntent_ride_id_key" ON "StripePaymentIntent"("ride_id");

-- AddForeignKey
ALTER TABLE "StripePaymentIntent" ADD CONSTRAINT "StripePaymentIntent_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
