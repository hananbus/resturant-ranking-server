/*
  Warnings:

  - You are about to drop the column `resturantId` on the `ranking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `resturants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resturantName` to the `ranking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ranking" DROP CONSTRAINT "ranking_resturantId_fkey";

-- AlterTable
ALTER TABLE "ranking" DROP COLUMN "resturantId",
ADD COLUMN     "resturantName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "resturants_name_key" ON "resturants"("name");

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_resturantName_fkey" FOREIGN KEY ("resturantName") REFERENCES "resturants"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
