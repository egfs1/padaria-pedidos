-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `suborders` DROP FOREIGN KEY `suborders_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `suborders` DROP FOREIGN KEY `suborders_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `suborders` DROP FOREIGN KEY `suborders_product_id_fkey`;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suborders` ADD CONSTRAINT `suborders_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
