/*
  Warnings:

  - A unique constraint covering the columns `[id,selectedDeckId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Games` DROP FOREIGN KEY `Games_victor_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Games` DROP FOREIGN KEY `User_Games_user_id_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_selectedDeckId_key` ON `User`(`id`, `selectedDeckId`);

-- AddForeignKey
ALTER TABLE `Games` ADD CONSTRAINT `Games_victor_id_fkey` FOREIGN KEY (`victor_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_user_id_selected_deck_fkey` FOREIGN KEY (`user_id`, `selected_deck`) REFERENCES `User`(`id`, `selectedDeckId`) ON DELETE SET NULL ON UPDATE CASCADE;
