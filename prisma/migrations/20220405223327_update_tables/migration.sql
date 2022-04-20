/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `date` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `companies_name_key` ON `companies`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `products_name_key` ON `products`(`name`);
