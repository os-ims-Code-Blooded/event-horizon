/*
  Warnings:

  - You are about to drop the column `userId` on the `Round_Effects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,name,description,damage,armor,image_url,duration,effect]` on the table `Cards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,name,description,damage,armor,image_url,duration,effect]` on the table `User_Cards` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_action_id_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_userId_fkey`;

-- DropForeignKey
ALTER TABLE `User_Cards` DROP FOREIGN KEY `User_Cards_card_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Deck_Cards` DROP FOREIGN KEY `User_Deck_Cards_card_id_fkey`;

-- AlterTable
ALTER TABLE `Round_Effects` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User_Cards` ADD COLUMN `armor` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `damage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `effect` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `User_Deck_Cards` ADD COLUMN `armor` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `damage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `effect` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Cards_id_name_description_damage_armor_image_url_duration_ef_key` ON `Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Cards_id_name_description_damage_armor_image_url_durati_key` ON `User_Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`);

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Cards` ADD CONSTRAINT `User_Cards_card_id_name_description_damage_armor_image_url__fkey` FOREIGN KEY (`card_id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) REFERENCES `Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Deck_Cards` ADD CONSTRAINT `User_Deck_Cards_card_id_name_description_damage_armor_image_fkey` FOREIGN KEY (`card_id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) REFERENCES `User_Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;
