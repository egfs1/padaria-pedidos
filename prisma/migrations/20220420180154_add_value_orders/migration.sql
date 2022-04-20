/*
  Warnings:

  - Added the required column `value` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `value` DOUBLE NOT NULL;
