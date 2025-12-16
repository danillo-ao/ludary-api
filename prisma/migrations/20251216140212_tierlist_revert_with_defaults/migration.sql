/*
  Warnings:

  - You are about to drop the column `bronzeCover` on the `UserTierList` table. All the data in the column will be lost.
  - You are about to drop the column `bronzeName` on the `UserTierList` table. All the data in the column will be lost.
  - You are about to drop the column `goldCover` on the `UserTierList` table. All the data in the column will be lost.
  - You are about to drop the column `goldName` on the `UserTierList` table. All the data in the column will be lost.
  - You are about to drop the column `silverCover` on the `UserTierList` table. All the data in the column will be lost.
  - You are about to drop the column `silverName` on the `UserTierList` table. All the data in the column will be lost.
  - The `gold` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `silver` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bronze` column on the `UserTierList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserTierList" DROP COLUMN "bronzeCover",
DROP COLUMN "bronzeName",
DROP COLUMN "goldCover",
DROP COLUMN "goldName",
DROP COLUMN "silverCover",
DROP COLUMN "silverName",
DROP COLUMN "gold",
ADD COLUMN     "gold" JSONB NOT NULL DEFAULT '{"id":0,"name":"","cover":""}',
DROP COLUMN "silver",
ADD COLUMN     "silver" JSONB NOT NULL DEFAULT '{"id":0,"name":"","cover":""}',
DROP COLUMN "bronze",
ADD COLUMN     "bronze" JSONB NOT NULL DEFAULT '{"id":0,"name":"","cover":""}';
