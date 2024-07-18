/*
  Warnings:

  - Added the required column `date` to the `todo_lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todo_lists" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
