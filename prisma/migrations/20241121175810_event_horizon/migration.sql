-- DropForeignKey
ALTER TABLE `User_Games` DROP FOREIGN KEY `User_Games_user_id_fkey`;

-- AlterTable
ALTER TABLE `User_Games` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
