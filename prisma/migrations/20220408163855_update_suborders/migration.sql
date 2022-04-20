/*
  Warnings:

  - You are about to drop the `sub_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sub_orders` DROP FOREIGN KEY `sub_orders_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_orders` DROP FOREIGN KEY `sub_orders_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_orders` DROP FOREIGN KEY `sub_orders_product_id_fkey`;

-- DropTable
DROP TABLE `sub_orders`;

-- CreateTable
CREATE TABLE `suborders` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
