-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'refunded';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RideStatus" ADD VALUE 'proposed';
ALTER TYPE "RideStatus" ADD VALUE 'accepted';

-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "driver_licence_id" DROP NOT NULL,
ALTER COLUMN "ride_status" DROP DEFAULT;
