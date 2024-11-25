-- DropForeignKey
ALTER TABLE `Actions` DROP FOREIGN KEY `Actions_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `Actions_Loaded` DROP FOREIGN KEY `Actions_Loaded_action_id_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Actions_Loaded` DROP FOREIGN KEY `Actions_Loaded_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `Actions_Loaded` DROP FOREIGN KEY `Actions_Loaded_round_id_fkey`;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
