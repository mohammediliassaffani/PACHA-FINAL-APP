/*
  Warnings:

  - You are about to drop the column `cin` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CNIMan]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CNIWoman]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CNIMan` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CNIWoman` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Person_cin_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "cin",
DROP COLUMN "profile",
ADD COLUMN     "CNIMan" TEXT NOT NULL,
ADD COLUMN     "CNIWoman" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "password" SET DEFAULT 'non-password';

-- CreateIndex
CREATE UNIQUE INDEX "Person_CNIMan_key" ON "Person"("CNIMan");

-- CreateIndex
CREATE UNIQUE INDEX "Person_CNIWoman_key" ON "Person"("CNIWoman");
