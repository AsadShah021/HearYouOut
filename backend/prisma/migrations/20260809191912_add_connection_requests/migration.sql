-- CreateTable
CREATE TABLE `connection_requests` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `listenerId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `message` TEXT NULL,
    `respondedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `connection_requests_listenerId_status_idx`(`listenerId`, `status`),
    INDEX `connection_requests_memberId_status_idx`(`memberId`, `status`),
    UNIQUE INDEX `connection_requests_memberId_listenerId_key`(`memberId`, `listenerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `connection_requests` ADD CONSTRAINT `connection_requests_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `connection_requests` ADD CONSTRAINT `connection_requests_listenerId_fkey` FOREIGN KEY (`listenerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
