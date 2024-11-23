-- AlterTable
ALTER TABLE `Cards` ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `selected_deck` INTEGER NULL;

-- AlterTable
ALTER TABLE `User_Decks` ADD COLUMN `game_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selected_deck_fkey` FOREIGN KEY (`selected_deck`) REFERENCES `User_Decks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Decks` ADD CONSTRAINT `User_Decks_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `User_Games`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
