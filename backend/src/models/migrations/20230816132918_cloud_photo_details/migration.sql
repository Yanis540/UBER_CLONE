-- CreateTable
CREATE TABLE "CloudPhotoDetails" (
    "asset_id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "access_mode" TEXT,
    "bytes" BIGINT,
    "created_at" TEXT,
    "etag" TEXT,
    "folder" TEXT,
    "format" TEXT,
    "height" BIGINT,
    "original_extension" TEXT,
    "original_filename" TEXT,
    "placeholder" BOOLEAN,
    "resource_type" TEXT,
    "secure_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "url" TEXT,
    "version" BIGINT,
    "version_id" TEXT,
    "width" BIGINT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CloudPhotoDetails_pkey" PRIMARY KEY ("asset_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudPhotoDetails_public_id_key" ON "CloudPhotoDetails"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "CloudPhotoDetails_user_id_key" ON "CloudPhotoDetails"("user_id");

-- AddForeignKey
ALTER TABLE "CloudPhotoDetails" ADD CONSTRAINT "CloudPhotoDetails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
