/*
  Warnings:

  - A unique constraint covering the columns `[episode_id]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Movie_episode_id_key" ON "Movie"("episode_id");
