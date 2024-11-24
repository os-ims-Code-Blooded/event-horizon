/*
  Warnings:

  - Made the column `damage` on table `Cards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `armor` on table `Cards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `Cards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Actions` DROP FOREIGN KEY `Actions_card_id_damage_armor_duration_effect_fkey`;

-- AlterTable
ALTER TABLE `Cards` MODIFY `damage` INTEGER NOT NULL DEFAULT 0,
    MODIFY `armor` INTEGER NOT NULL DEFAULT 0,
    MODIFY `duration` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Round_Actions_Loaded` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `damage` INTEGER NOT NULL,
    `armor` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `effect` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Round_Effects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `damage` INTEGER NOT NULL,
    `armor` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `effect` VARCHAR(191) NOT NULL,
    `time_elapsed` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Round_Player_Info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `health` INTEGER NOT NULL DEFAULT 50,
    `armor` INTEGER NOT NULL DEFAULT 20,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions_Loaded` ADD CONSTRAINT `Round_Actions_Loaded_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions_Loaded` ADD CONSTRAINT `Round_Actions_Loaded_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `Actions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Actions_Loaded` ADD CONSTRAINT `Round_Actions_Loaded_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `Actions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
