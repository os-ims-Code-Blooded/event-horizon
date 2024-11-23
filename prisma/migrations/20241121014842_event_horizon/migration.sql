/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Cards` table. All the data in the column will be lost.
  - You are about to drop the column `selected_deck` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `User_Decks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_selected_deck_fkey`;

-- DropForeignKey
ALTER TABLE `User_Decks` DROP FOREIGN KEY `User_Decks_game_id_fkey`;

-- AlterTable
ALTER TABLE `Cards` DROP COLUMN `isArchived`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `selected_deck`;

-- AlterTable
ALTER TABLE `User_Decks` DROP COLUMN `game_id`;
