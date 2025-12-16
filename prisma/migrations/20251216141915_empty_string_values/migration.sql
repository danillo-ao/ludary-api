-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" DROP DEFAULT,
ALTER COLUMN "cover" DROP NOT NULL,
ALTER COLUMN "cover" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserDiaryPages" ALTER COLUMN "gameDescription" DROP NOT NULL,
ALTER COLUMN "gameDescription" DROP DEFAULT,
ALTER COLUMN "gameCover" DROP NOT NULL,
ALTER COLUMN "gameCover" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserTierList" ALTER COLUMN "gold" SET DEFAULT '{"id":null,"name":null,"cover":null}',
ALTER COLUMN "silver" SET DEFAULT '{"id":null,"name":null,"cover":null}',
ALTER COLUMN "bronze" SET DEFAULT '{"id":null,"name":null,"cover":null}';
