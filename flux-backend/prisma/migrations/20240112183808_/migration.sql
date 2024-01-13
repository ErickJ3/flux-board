/*
  Warnings:

  - You are about to drop the column `list_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `lists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `board_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BACKLOG', 'TODO', 'INPROGRESS', 'DONE', 'CANCELED');

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_board_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_list_id_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "list_id",
ADD COLUMN     "board_id" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'BACKLOG';

-- DropTable
DROP TABLE "lists";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
