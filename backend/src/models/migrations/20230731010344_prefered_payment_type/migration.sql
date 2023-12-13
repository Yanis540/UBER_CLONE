-- AlterTable
ALTER TABLE "User" ADD COLUMN     "prefered_payment_type" "PaymentType" NOT NULL DEFAULT 'cash';
