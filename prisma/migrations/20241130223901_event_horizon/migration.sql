-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `google_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `selectedDeckId` INTEGER NULL,

    UNIQUE INDEX `User_google_id_key`(`google_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_id_selectedDeckId_key`(`id`, `selectedDeckId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friends` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,

    UNIQUE INDEX `Friends_user_id_friend_id_key`(`user_id`, `friend_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Games` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NULL,
    `victor_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Games` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `selected_deck` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rounds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `action` VARCHAR(191) NULL,
    `damage` INTEGER NULL DEFAULT 0,
    `armor` INTEGER NULL DEFAULT 0,
    `duration` INTEGER NULL DEFAULT 0,
    `effect` VARCHAR(191) NULL DEFAULT '',
    `card_id` INTEGER NULL,

    UNIQUE INDEX `Actions_id_user_id_key`(`id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actions_Loaded` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `round_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NULL,
    `damage` INTEGER NULL,
    `armor` INTEGER NULL,
    `duration` INTEGER NULL,
    `effect` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Round_Effects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `game_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NULL,
    `damage` INTEGER NULL,
    `armor` INTEGER NULL,
    `duration` INTEGER NULL,
    `effect` VARCHAR(191) NULL,
    `time_elapsed` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Round_Player_Info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `health` INTEGER NOT NULL DEFAULT 50,
    `armor` INTEGER NOT NULL DEFAULT 20,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `damage` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(191) NOT NULL DEFAULT '',
    `duration` INTEGER NOT NULL DEFAULT 0,
    `effect` VARCHAR(191) NOT NULL DEFAULT '',
    `score_required` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Cards_id_damage_armor_duration_effect_key`(`id`, `damage`, `armor`, `duration`, `effect`),
    UNIQUE INDEX `Cards_id_name_description_damage_armor_image_url_duration_ef_key`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `earnedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `damage` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(191) NOT NULL DEFAULT '',
    `duration` INTEGER NOT NULL DEFAULT 0,
    `effect` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `User_Cards_id_name_description_damage_armor_image_url_durati_key`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Decks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `deck_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Deck_Cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deck_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `damage` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(191) NOT NULL DEFAULT '',
    `duration` INTEGER NOT NULL DEFAULT 0,
    `effect` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selectedDeckId_fkey` FOREIGN KEY (`selectedDeckId`) REFERENCES `User_Decks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_friend_id_fkey` FOREIGN KEY (`friend_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Games` ADD CONSTRAINT `Games_victor_id_fkey` FOREIGN KEY (`victor_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Games` ADD CONSTRAINT `User_Games_user_id_selected_deck_fkey` FOREIGN KEY (`user_id`, `selected_deck`) REFERENCES `User`(`id`, `selectedDeckId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rounds` ADD CONSTRAINT `Rounds_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions_Loaded` ADD CONSTRAINT `Actions_Loaded_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_action_id_user_id_fkey` FOREIGN KEY (`action_id`, `user_id`) REFERENCES `Actions`(`id`, `user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_card_id_damage_armor_duration_effect_fkey` FOREIGN KEY (`card_id`, `damage`, `armor`, `duration`, `effect`) REFERENCES `Cards`(`id`, `damage`, `armor`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Effects` ADD CONSTRAINT `Round_Effects_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round_Player_Info` ADD CONSTRAINT `Round_Player_Info_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `Rounds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Cards` ADD CONSTRAINT `User_Cards_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Cards` ADD CONSTRAINT `User_Cards_card_id_name_description_damage_armor_image_url__fkey` FOREIGN KEY (`card_id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) REFERENCES `Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Decks` ADD CONSTRAINT `User_Decks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Deck_Cards` ADD CONSTRAINT `User_Deck_Cards_deck_id_fkey` FOREIGN KEY (`deck_id`) REFERENCES `User_Decks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Deck_Cards` ADD CONSTRAINT `User_Deck_Cards_card_id_name_description_damage_armor_image_fkey` FOREIGN KEY (`card_id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) REFERENCES `User_Cards`(`id`, `name`, `description`, `damage`, `armor`, `image_url`, `duration`, `effect`) ON DELETE CASCADE ON UPDATE CASCADE;
