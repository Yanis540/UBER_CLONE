/*
  Warnings:

  - Made the column `car_id` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Driver_car_id_key";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "car_id" SET NOT NULL;
