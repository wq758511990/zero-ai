/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatContent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `ChatContent_userId_fkey` ON `ChatContent`;

-- AlterTable
ALTER TABLE `ChatContent` DROP COLUMN `userId`;
