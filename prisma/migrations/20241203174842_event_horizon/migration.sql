/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Round_Player_Info` DROP FOREIGN KEY `Round_Player_Info_user_id_fkey`;

-- AlterTable
ALTER TABLE `Round_Player_Info` ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `losses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `wins` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `User_Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `dark_mode` BOOLEAN NOT NULL DEFAULT false,
    `colorblind_mode` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_name_key` ON `User`(`id`, `name`);

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_user_id_name_fkey` FOREIGN KEY (`user_id`, `name`) REFERENCES `User`(`id`, `name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Settings` ADD CONSTRAINT `User_Settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
