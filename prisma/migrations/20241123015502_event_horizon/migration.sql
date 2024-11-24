-- AlterTable
ALTER TABLE `Round_Effects` MODIFY `card_id` INTEGER NULL,
    MODIFY `damage` INTEGER NULL,
    MODIFY `armor` INTEGER NULL,
    MODIFY `duration` INTEGER NULL,
    MODIFY `effect` VARCHAR(191) NULL,
    MODIFY `time_elapsed` INTEGER NOT NULL DEFAULT 0;
