/*
  Warnings:

  - The values [gift_card] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('cash', 'card');
ALTER TABLE "User" ALTER COLUMN "prefered_payment_type" DROP DEFAULT;
ALTER TABLE "Ride" ALTER COLUMN "payment_type" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "prefered_payment_type" TYPE "PaymentType_new" USING ("prefered_payment_type"::text::"PaymentType_new");
ALTER TABLE "Ride" ALTER COLUMN "payment_type" TYPE "PaymentType_new" USING ("payment_type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
ALTER TABLE "User" ALTER COLUMN "prefered_payment_type" SET DEFAULT 'cash';
ALTER TABLE "Ride" ALTER COLUMN "payment_type" SET DEFAULT 'cash';
COMMIT;
