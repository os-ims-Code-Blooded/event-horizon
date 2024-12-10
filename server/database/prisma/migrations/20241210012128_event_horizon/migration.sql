-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_round_id_fkey`;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
