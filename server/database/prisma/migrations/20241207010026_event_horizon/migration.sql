/*
  Warnings:

  - You are about to alter the column `deck` on the `Game_Card_States` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `hand` on the `Game_Card_States` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Game_Card_States` MODIFY `deck` JSON NULL,
    MODIFY `hand` JSON NULL;
