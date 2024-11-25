/*
  Warnings:

  - Added the required column `game_id` to the `Actions_Loaded` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Actions_Loaded` ADD COLUMN `game_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
