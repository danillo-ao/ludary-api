/*
  Warnings:

  - You are about to drop the `Diary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiaryPages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diary" DROP CONSTRAINT "Diary_idUser_fkey";

-- DropForeignKey
ALTER TABLE "DiaryPages" DROP CONSTRAINT "DiaryPages_idDiary_fkey";

-- DropForeignKey
ALTER TABLE "DiaryPages" DROP CONSTRAINT "DiaryPages_idUser_fkey";

-- DropTable
DROP TABLE "Diary";

-- DropTable
DROP TABLE "DiaryPages";

-- CreateTable
CREATE TABLE "UserDiary" (
    "id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "amountPages" INTEGER NOT NULL DEFAULT 0,
    "amountGames" INTEGER NOT NULL DEFAULT 0,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDiaryPages" (
    "id" SERIAL NOT NULL,
    "idDiary" INTEGER NOT NULL,
    "idGame" INTEGER NOT NULL,
    "idUser" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL DEFAULT '',
    "gameCover" TEXT NOT NULL DEFAULT '',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "mood" INTEGER,
    "registerDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDiaryPages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDiary_idUser_key" ON "UserDiary"("idUser");

-- AddForeignKey
ALTER TABLE "UserDiary" ADD CONSTRAINT "UserDiary_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiaryPages" ADD CONSTRAINT "UserDiaryPages_idDiary_fkey" FOREIGN KEY ("idDiary") REFERENCES "UserDiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiaryPages" ADD CONSTRAINT "UserDiaryPages_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
