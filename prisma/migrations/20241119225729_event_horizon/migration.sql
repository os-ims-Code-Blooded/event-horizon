/*
  Warnings:

  - You are about to drop the column `socket` on the `Games` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Games_socket_key` ON `Games`;

-- AlterTable
ALTER TABLE `Games` DROP COLUMN `socket`;
