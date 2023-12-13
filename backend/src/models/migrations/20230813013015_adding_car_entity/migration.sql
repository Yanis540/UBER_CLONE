/*
  Warnings:

  - You are about to drop the column `car_type` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "car_type",
ALTER COLUMN "car_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Car" (
    "car_id" TEXT NOT NULL,
    "car_type" "CarType" NOT NULL DEFAULT 'standard',
    "car_model" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3),
    "licence_id" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("car_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_licence_id_key" ON "Car"("licence_id");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_licence_id_fkey" FOREIGN KEY ("licence_id") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;
