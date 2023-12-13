/*
  Warnings:

  - Made the column `access_mode` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `folder` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resource_type` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secure_url` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `signature` on table `CloudPhotoDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CloudPhotoDetails" ALTER COLUMN "access_mode" SET NOT NULL,
ALTER COLUMN "folder" SET NOT NULL,
ALTER COLUMN "resource_type" SET NOT NULL,
ALTER COLUMN "secure_url" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "signature" SET NOT NULL;
