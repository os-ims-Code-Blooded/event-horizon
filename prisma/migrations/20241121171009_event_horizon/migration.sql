/*
  Warnings:

  - You are about to drop the column `deck_name` on the `User_Games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_friend_id_fkey`;

-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Games` DROP FOREIGN KEY `Games_victor_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Rounds` DROP FOREIGN KEY `Rounds_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Cards` DROP FOREIGN KEY `User_Cards_card_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Cards` DROP FOREIGN KEY `User_Cards_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Deck_Cards` DROP FOREIGN KEY `User_Deck_Cards_card_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Deck_Cards` DROP FOREIGN KEY `User_Deck_Cards_deck_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Decks` DROP FOREIGN KEY `User_Decks_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Games` DROP FOREIGN KEY `User_Games_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Games` DROP FOREIGN KEY `User_Games_user_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `selected_deck` INTEGER NULL;

-- AlterTable
ALTER TABLE `User_Games` DROP COLUMN `deck_name`,
    ADD COLUMN `selected_deck` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_friend_id_fkey` FOREIGN KEY (`friend_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Games` ADD CONSTRAINT `Games_victor_id_fkey` FOREIGN KEY (`victor_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rounds` ADD CONSTRAINT `Rounds_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions` ADD CONSTRAINT `Round_Actions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions` ADD CONSTRAINT `Round_Actions_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions` ADD CONSTRAINT `Round_Actions_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Cards` ADD CONSTRAINT `User_Cards_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Cards` ADD CONSTRAINT `User_Cards_card_id_fkey` FOREIGN KEY (`card_id`) REFERENCES `Cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Decks` ADD CONSTRAINT `User_Decks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Deck_Cards` ADD CONSTRAINT `User_Deck_Cards_deck_id_fkey` FOREIGN KEY (`deck_id`) REFERENCES `User_Decks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Deck_Cards` ADD CONSTRAINT `User_Deck_Cards_card_id_fkey` FOREIGN KEY (`card_id`) REFERENCES `Cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
