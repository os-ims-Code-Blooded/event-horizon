/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `User_Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_Settings_user_id_key` ON `User_Settings`(`user_id`);
