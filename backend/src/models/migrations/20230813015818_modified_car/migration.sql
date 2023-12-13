-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "car_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "car_id" TEXT;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("car_id") ON DELETE CASCADE ON UPDATE CASCADE;
