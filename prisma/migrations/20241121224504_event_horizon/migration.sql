/*
  Warnings:

  - A unique constraint covering the columns `[id,damage,armor,duration,effect]` on the table `Cards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Actions` ADD COLUMN `card_id` INTEGER NULL,
    ADD COLUMN `duration` INTEGER NULL DEFAULT 0,
    ADD COLUMN `effect` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Cards` ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `effect` VARCHAR(191) NULL,
    MODIFY `image_url` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cards_id_damage_armor_duration_effect_key` ON `Cards`(`id`, `damage`, `armor`, `duration`, `effect`);

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE SET NULL ON UPDATE CASCADE;
