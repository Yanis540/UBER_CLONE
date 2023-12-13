/*
  Warnings:

  - Made the column `car_id` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "car_id" SET NOT NULL;
