/*
  Warnings:

  - Added the required column `rank` to the `ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ranking" ADD COLUMN     "rank" INTEGER NOT NULL;
