-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('standard', 'premium', 'family', 'suv');

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "car_type" "CarType" NOT NULL DEFAULT 'standard';
