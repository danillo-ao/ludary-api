-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "followersAmount" INTEGER NOT NULL DEFAULT 0,
    "followingAmount" INTEGER NOT NULL DEFAULT 0,
    "reviewsAmount" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT NOT NULL DEFAULT 'null',
    "cover" TEXT NOT NULL DEFAULT 'null',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "developer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTierList" (
    "id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "gold" JSONB NOT NULL DEFAULT '{}',
    "silver" JSONB NOT NULL DEFAULT '{}',
    "bronze" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserTierList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPrivacy" (
    "id" SERIAL NOT NULL,
    "idUser" TEXT NOT NULL,
    "favorites" BOOLEAN NOT NULL DEFAULT true,
    "backlog" BOOLEAN NOT NULL DEFAULT true,
    "wishlist" BOOLEAN NOT NULL DEFAULT true,
    "playing" BOOLEAN NOT NULL DEFAULT true,
    "paused" BOOLEAN NOT NULL DEFAULT true,
    "finished" BOOLEAN NOT NULL DEFAULT true,
    "dropped" BOOLEAN NOT NULL DEFAULT true,
    "profile" BOOLEAN NOT NULL DEFAULT true,
    "diary" BOOLEAN NOT NULL DEFAULT false,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPrivacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "amountPages" INTEGER NOT NULL DEFAULT 0,
    "amountGames" INTEGER NOT NULL DEFAULT 0,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryPages" (
    "id" SERIAL NOT NULL,
    "idDiary" INTEGER NOT NULL,
    "idGame" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL DEFAULT '',
    "gameCover" TEXT NOT NULL DEFAULT '',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "mood" INTEGER,
    "registerDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaryPages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "id" SERIAL NOT NULL,
    "followerId" TEXT NOT NULL,
    "followedId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocks" (
    "id" SERIAL NOT NULL,
    "blockedId" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "idGame" INTEGER NOT NULL,
    "gameCover" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "review" TEXT NOT NULL,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "platforms" TEXT,
    "playTime" INTEGER,
    "startDate" TIMESTAMP(3),
    "finishDate" TIMESTAMP(3),
    "playProgress" INTEGER,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMetrics" (
    "id" SERIAL NOT NULL,
    "idGame" INTEGER NOT NULL,
    "reviewsAmount" INTEGER NOT NULL DEFAULT 0,
    "reviewsAvarage" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "GameMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collections" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "color" BIGINT NOT NULL,
    "icon" BIGINT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamesInCollections" (
    "id" SERIAL NOT NULL,
    "idCollection" INTEGER NOT NULL,
    "idGame" INTEGER NOT NULL,
    "gameCover" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GamesInCollections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatus" (
    "id" SERIAL NOT NULL,
    "idGame" INTEGER NOT NULL,
    "idUser" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "gameCover" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "idGame" INTEGER NOT NULL,
    "gameCover" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDescription" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExploreList" (
    "id" SERIAL NOT NULL,
    "highlight" TEXT NOT NULL,
    "topSellers" TEXT NOT NULL,
    "topWanted" TEXT NOT NULL,
    "topNewest" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExploreList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_email_key" ON "User"("nickname", "email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTierList_idUser_key" ON "UserTierList"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivacy_idUser_key" ON "UserPrivacy"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_owner_key" ON "Diary"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Follows_followerId_followedId_key" ON "Follows"("followerId", "followedId");

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_blockedId_blockerId_key" ON "Blocks"("blockedId", "blockerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_idGame_author_key" ON "Review"("idGame", "author");

-- CreateIndex
CREATE UNIQUE INDEX "GameMetrics_idGame_key" ON "GameMetrics"("idGame");

-- CreateIndex
CREATE UNIQUE INDEX "GameStatus_idGame_idUser_key" ON "GameStatus"("idGame", "idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_idGame_idUser_key" ON "Favorites"("idGame", "idUser");

-- AddForeignKey
ALTER TABLE "UserTierList" ADD CONSTRAINT "UserTierList_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivacy" ADD CONSTRAINT "UserPrivacy_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryPages" ADD CONSTRAINT "DiaryPages_idDiary_fkey" FOREIGN KEY ("idDiary") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryPages" ADD CONSTRAINT "DiaryPages_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesInCollections" ADD CONSTRAINT "GamesInCollections_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesInCollections" ADD CONSTRAINT "GamesInCollections_idCollection_fkey" FOREIGN KEY ("idCollection") REFERENCES "Collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatus" ADD CONSTRAINT "GameStatus_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
