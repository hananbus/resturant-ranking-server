/*
  Warnings:

  - You are about to alter the column `rank` on the `ranking` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `rank` on table `ranking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ranking" ALTER COLUMN "rank" SET NOT NULL,
ALTER COLUMN "rank" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "resturants" ALTER COLUMN "rank" SET DATA TYPE DOUBLE PRECISION;
