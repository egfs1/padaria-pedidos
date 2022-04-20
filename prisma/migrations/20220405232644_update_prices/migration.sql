/*
  Warnings:

  - You are about to drop the column `value` on the `prices` table. All the data in the column will be lost.
  - Added the required column `price` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prices` DROP COLUMN `value`,
    ADD COLUMN `price` DOUBLE NOT NULL;
