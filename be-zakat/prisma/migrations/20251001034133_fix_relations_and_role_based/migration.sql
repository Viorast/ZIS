/*
  Warnings:

  - You are about to drop the column `admin_id` on the `infaq_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `admin_id` on the `zakat_transactions` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('JAMAAH', 'PETUGAS', 'BENDAHARA', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "infaq_transactions" DROP CONSTRAINT "infaq_transactions_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "zakat_transactions" DROP CONSTRAINT "zakat_transactions_admin_id_fkey";

-- AlterTable
ALTER TABLE "infaq_transactions" DROP COLUMN "admin_id",
ADD COLUMN     "processed_by_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pengurus_id" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'JAMAAH';

-- AlterTable
ALTER TABLE "zakat_transactions" DROP COLUMN "admin_id",
ADD COLUMN     "processed_by_id" TEXT;

-- DropTable
DROP TABLE "admins";

-- DropEnum
DROP TYPE "AdminRole";

-- AddForeignKey
ALTER TABLE "infaq_transactions" ADD CONSTRAINT "infaq_transactions_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zakat_transactions" ADD CONSTRAINT "zakat_transactions_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
