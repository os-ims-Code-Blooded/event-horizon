/*
  Warnings:

  - Added the required column `game_id` to the `Round_Effects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Round_Effects` ADD COLUMN `game_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
