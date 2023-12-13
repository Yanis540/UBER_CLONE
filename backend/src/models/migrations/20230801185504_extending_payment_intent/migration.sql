/*
  Warnings:

  - You are about to drop the column `payment_gateway` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `ride_id` on the `StripePaymentIntent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripePaymentIntent" DROP CONSTRAINT "StripePaymentIntent_ride_id_fkey";

-- DropIndex
DROP INDEX "StripePaymentIntent_ride_id_key";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "payment_gateway";

-- AlterTable
ALTER TABLE "StripePaymentIntent" DROP COLUMN "ride_id";

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "payment_gateway" "PaymentGateway" NOT NULL,
    "ride_id" TEXT,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_id_key" ON "PaymentIntent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_ride_id_key" ON "PaymentIntent"("ride_id");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePaymentIntent" ADD CONSTRAINT "StripePaymentIntent_id_fkey" FOREIGN KEY ("id") REFERENCES "PaymentIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
