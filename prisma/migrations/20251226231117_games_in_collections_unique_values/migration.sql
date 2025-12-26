/*
  Warnings:

  - A unique constraint covering the columns `[idGame,idCollection,idUser]` on the table `GamesInCollections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GamesInCollections_idGame_idCollection_idUser_key" ON "GamesInCollections"("idGame", "idCollection", "idUser");
