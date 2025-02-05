-- AlterTable
ALTER TABLE `Employee` MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `phone` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(50) NOT NULL,
    MODIFY `nickname` VARCHAR(50) NOT NULL DEFAULT '',
    MODIFY `username` VARCHAR(50) NOT NULL;
