-- AlterTable
ALTER TABLE "Favorites" ALTER COLUMN "gameCover" DROP NOT NULL,
ALTER COLUMN "gameDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameStatus" ALTER COLUMN "gameCover" DROP NOT NULL,
ALTER COLUMN "gameDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GamesInCollections" ALTER COLUMN "gameCover" DROP NOT NULL,
ALTER COLUMN "gameDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "gameCover" DROP NOT NULL,
ALTER COLUMN "gameDescription" DROP NOT NULL;
