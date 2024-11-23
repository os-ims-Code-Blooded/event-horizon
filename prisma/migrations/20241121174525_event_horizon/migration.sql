/*
  Warnings:

  - You are about to drop the column `selected_deck` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `selected_deck`,
    ADD COLUMN `selectedDeckId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selectedDeckId_fkey` FOREIGN KEY (`selectedDeckId`) REFERENCES `User_Decks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
