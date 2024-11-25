-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_action_id_fkey`;

-- AlterTable
ALTER TABLE `Round_Effects` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
