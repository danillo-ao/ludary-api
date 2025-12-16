/*
  Warnings:

  - You are about to drop the column `owner` on the `Collections` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Diary` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `DiaryPages` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `GamesInCollections` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUser]` on the table `Diary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idGame,idUser]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `Collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `DiaryPages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `GamesInCollections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collections" DROP CONSTRAINT "Collections_owner_fkey";

-- DropForeignKey
ALTER TABLE "Diary" DROP CONSTRAINT "Diary_owner_fkey";

-- DropForeignKey
ALTER TABLE "DiaryPages" DROP CONSTRAINT "DiaryPages_author_fkey";

-- DropForeignKey
ALTER TABLE "GamesInCollections" DROP CONSTRAINT "GamesInCollections_owner_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_author_fkey";

-- DropIndex
DROP INDEX "Diary_owner_key";

-- DropIndex
DROP INDEX "Review_idGame_author_key";

-- AlterTable
ALTER TABLE "Collections" DROP COLUMN "owner",
ADD COLUMN     "idUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Diary" DROP COLUMN "owner",
ADD COLUMN     "idUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DiaryPages" DROP COLUMN "author",
ADD COLUMN     "idUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GamesInCollections" DROP COLUMN "owner",
ADD COLUMN     "idUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "author",
ADD COLUMN     "idUser" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Diary_idUser_key" ON "Diary"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Review_idGame_idUser_key" ON "Review"("idGame", "idUser");

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryPages" ADD CONSTRAINT "DiaryPages_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesInCollections" ADD CONSTRAINT "GamesInCollections_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
