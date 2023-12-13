-- CreateTable
CREATE TABLE "StripePaymentIntent" (
    "id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "ephemeralKey_secret" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "StripePaymentIntent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripePaymentIntent" ADD CONSTRAINT "StripePaymentIntent_id_fkey" FOREIGN KEY ("id") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
