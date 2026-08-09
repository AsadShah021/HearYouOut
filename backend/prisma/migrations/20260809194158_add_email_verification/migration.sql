-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL;

-- Grandfather every account that already exists.
--
-- Verification is a hard gate: without this, the moment this migration lands,
-- every current member, listener and admin is locked out of the site by a code
-- that was never sent to them. Their addresses were accepted under the rules
-- that applied when they signed up, and this is not the moment to re-litigate
-- that. Only accounts created from here on have to prove the address.
UPDATE `users` SET `emailVerifiedAt` = `createdAt` WHERE `emailVerifiedAt` IS NULL;

-- CreateTable
CREATE TABLE `email_otps` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `codeHash` CHAR(64) NOT NULL,
    `purpose` ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NOT NULL,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `email_otps_userId_purpose_consumedAt_idx`(`userId`, `purpose`, `consumedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_otps` ADD CONSTRAINT `email_otps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
