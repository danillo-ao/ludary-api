/*
  Warnings:

  - You are about to drop the column `createDate` on the `UserBadges` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `UserMetrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserBadges" DROP COLUMN "createDate";

-- AlterTable
ALTER TABLE "UserMetrics" DROP COLUMN "createDate";
