/*
  Warnings:

  - You are about to drop the column `userId` on the `Round_Effects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_action_id_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Round_Effects` DROP FOREIGN KEY `Round_Effects_userId_fkey`;

-- AlterTable
ALTER TABLE `Round_Effects` DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
