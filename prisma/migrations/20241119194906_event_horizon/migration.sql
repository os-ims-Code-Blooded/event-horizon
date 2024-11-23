/*
  Warnings:

  - A unique constraint covering the columns `[socket]` on the table `Games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socket` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Games` ADD COLUMN `socket` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Games_socket_key` ON `Games`(`socket`);
