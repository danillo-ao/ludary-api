/*
  Warnings:

  - Changed the type of `status` on the `GameStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameStatusEnum" AS ENUM ('backlog', 'playing', 'paused', 'finished', 'wishlist', 'dropped');

-- AlterTable
ALTER TABLE "GameStatus" DROP COLUMN "status",
ADD COLUMN     "status" "GameStatusEnum" NOT NULL;
