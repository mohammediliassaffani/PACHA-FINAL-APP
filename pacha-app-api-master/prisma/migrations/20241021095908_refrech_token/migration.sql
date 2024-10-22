-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "docs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "profile" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "password" SET DEFAULT 'no-password';
