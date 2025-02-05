/*
  Warnings:

  - Added the required column `quest` to the `ChatContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChatContent` ADD COLUMN `quest` TEXT NOT NULL,
    MODIFY `role` VARCHAR(50) NOT NULL;
