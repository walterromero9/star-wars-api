/*
  Warnings:

  - You are about to drop the column `releaseYear` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `director` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episode_id` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening_crawl` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producer` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "releaseYear",
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "episode_id" INTEGER NOT NULL,
ADD COLUMN     "opening_crawl" TEXT NOT NULL,
ADD COLUMN     "producer" TEXT NOT NULL,
ADD COLUMN     "release_date" TIMESTAMP(3) NOT NULL;
