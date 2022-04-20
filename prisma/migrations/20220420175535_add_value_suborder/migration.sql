/*
  Warnings:

  - Added the required column `value` to the `suborders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suborders` ADD COLUMN `value` DOUBLE NOT NULL;
