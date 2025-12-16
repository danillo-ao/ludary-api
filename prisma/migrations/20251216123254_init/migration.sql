/*
  Warnings:

  - You are about to drop the column `developer` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followersAmount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingAmount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsAmount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "developer",
DROP COLUMN "followersAmount",
DROP COLUMN "followingAmount",
DROP COLUMN "reviewsAmount",
DROP COLUMN "verified";

-- CreateTable
CREATE TABLE "UserBadges" (
    "id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "developer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserBadges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetrics" (
    "id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followersAmount" INTEGER NOT NULL DEFAULT 0,
    "followingAmount" INTEGER NOT NULL DEFAULT 0,
    "reviewsAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBadges_idUser_key" ON "UserBadges"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetrics_idUser_key" ON "UserMetrics"("idUser");

-- AddForeignKey
ALTER TABLE "UserBadges" ADD CONSTRAINT "UserBadges_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetrics" ADD CONSTRAINT "UserMetrics_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
