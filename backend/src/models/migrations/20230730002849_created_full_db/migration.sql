-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('progress', 'cancelled', 'finished');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('succeeded', 'cancelled', 'processing');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('cash', 'card', 'gift_card');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('stripe');

-- CreateTable
CREATE TABLE "Driver" (
    "licence_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "total_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("licence_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "user_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "adr_address" TEXT,
    "formatted_address" TEXT,
    "place_id" TEXT,
    "vicinity" TEXT NOT NULL,
    "localisation" JSONB NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "user_gps_localisation" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,
    "driver_licence_id" TEXT NOT NULL,
    "starting_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrived_at" TIMESTAMP(3),
    "total_time" TEXT,
    "start_address_id" TEXT NOT NULL,
    "destination_address_id" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "cause_cancellation" VARCHAR(500),
    "payment_type" "PaymentType" NOT NULL DEFAULT 'cash',
    "payment_status" "PaymentStatus" NOT NULL,
    "payment_gateway" "PaymentGateway",
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "ride_status" "RideStatus" NOT NULL DEFAULT 'progress',

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserLikedComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_car_id_key" ON "Driver"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikedComments_AB_unique" ON "_UserLikedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikedComments_B_index" ON "_UserLikedComments"("B");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_licence_id_fkey" FOREIGN KEY ("licence_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driver_licence_id_fkey" FOREIGN KEY ("driver_licence_id") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_start_address_id_fkey" FOREIGN KEY ("start_address_id") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_destination_address_id_fkey" FOREIGN KEY ("destination_address_id") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedComments" ADD CONSTRAINT "_UserLikedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedComments" ADD CONSTRAINT "_UserLikedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
