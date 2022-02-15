/*
  Warnings:

  - You are about to drop the column `external_id` on the `events` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "events_external_id_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "external_id";
