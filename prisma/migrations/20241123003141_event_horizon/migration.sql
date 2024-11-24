/*
  Warnings:

  - You are about to drop the `Round_Actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Round_Actions_Loaded` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,user_id]` on the table `Actions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `round_id` to the `Actions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Actions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions` DROP FOREIGN KEY `Round_Actions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions_Loaded` DROP FOREIGN KEY `Round_Actions_Loaded_action_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions_Loaded` DROP FOREIGN KEY `Round_Actions_Loaded_card_id_damage_armor_duration_effect_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Actions_Loaded` DROP FOREIGN KEY `Round_Actions_Loaded_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Player_Info` DROP FOREIGN KEY `Round_Player_Info_round_id_fkey`;

-- AlterTable
ALTER TABLE `Actions` ADD COLUMN `round_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Round_Actions`;

-- DropTable
DROP TABLE `Round_Actions_Loaded`;

-- CreateTable
CREATE TABLE `Actions_Loaded` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NULL,
    `damage` INTEGER NULL,
    `armor` INTEGER NULL,
    `duration` INTEGER NULL,
    `effect` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Actions_id_user_id_key` ON `Actions`(`id`, `user_id`);

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
