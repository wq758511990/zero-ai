/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_departmentId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `age`;

-- DropTable
DROP TABLE `Department`;

-- DropTable
DROP TABLE `Employee`;
