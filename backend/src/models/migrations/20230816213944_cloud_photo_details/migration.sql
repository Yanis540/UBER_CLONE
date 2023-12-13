/*
  Warnings:

  - You are about to drop the column `bytes` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `etag` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `original_extension` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `original_filename` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `placeholder` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `version_id` on the `CloudPhotoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `CloudPhotoDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CloudPhotoDetails" DROP COLUMN "bytes",
DROP COLUMN "created_at",
DROP COLUMN "etag",
DROP COLUMN "format",
DROP COLUMN "height",
DROP COLUMN "original_extension",
DROP COLUMN "original_filename",
DROP COLUMN "placeholder",
DROP COLUMN "tags",
DROP COLUMN "version",
DROP COLUMN "version_id",
DROP COLUMN "width";
