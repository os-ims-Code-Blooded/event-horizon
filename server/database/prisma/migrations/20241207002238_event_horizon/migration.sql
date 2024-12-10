-- CreateTable
CREATE TABLE `Game_Card_States` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `deck` VARCHAR(191) NULL,
    `hand` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game_Card_States` ADD CONSTRAINT `Game_Card_States_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game_Card_States` ADD CONSTRAINT `Game_Card_States_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
