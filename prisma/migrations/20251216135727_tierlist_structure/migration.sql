/*
  Warnings:

  - The `gold` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `silver` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bronze` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserTierList" ADD COLUMN     "bronzeCover" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bronzeName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "goldCover" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "goldName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "silverCover" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "silverName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "gold",
ADD COLUMN     "gold" INTEGER,
DROP COLUMN "silver",
ADD COLUMN     "silver" INTEGER,
DROP COLUMN "bronze",
ADD COLUMN     "bronze" INTEGER;
