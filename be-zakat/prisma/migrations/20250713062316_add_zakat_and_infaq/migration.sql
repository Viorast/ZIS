-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'EXPIRED', 'CANCELLED', 'FAILED');

-- CreateEnum  
CREATE TYPE "ZakatType" AS ENUM ('FITRAH', 'MAAL', 'PENGHASILAN', 'EMAS', 'FIDYAH');

-- AlterEnum - Handle PaymentMethod enum modification
-- First, check if we need to update existing tables
DO $$
BEGIN
    -- If tables exist, update the data first
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'zakat_transactions') THEN
        -- Update existing data to new enum values
        UPDATE zakat_transactions SET payment_method = 'QRIS_MANUAL' WHERE payment_method = 'QRIS';
        UPDATE zakat_transactions SET payment_method = 'MIDTRANS' WHERE payment_method = 'TRANSFER';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'infaq_transactions') THEN
        UPDATE infaq_transactions SET payment_method = 'QRIS_MANUAL' WHERE payment_method = 'QRIS';
        UPDATE infaq_transactions SET payment_method = 'MIDTRANS' WHERE payment_method = 'TRANSFER';
    END IF;
END $$;

-- Recreate the enum with new values
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('MIDTRANS', 'QRIS_MANUAL', 'TUNAI');

-- Update existing table columns if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'zakat_transactions') THEN
        ALTER TABLE "zakat_transactions" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'infaq_transactions') THEN
        ALTER TABLE "infaq_transactions" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
    END IF;
END $$;

-- Drop old enum and rename new one
DROP TYPE IF EXISTS "PaymentMethod";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
COMMIT;

-- CreateTable (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS "infaq_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "nominal" DECIMAL(15,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "bukti_pembayaran" TEXT,
    "midtrans_id" TEXT,
    "catatan" TEXT,
    "tanggal_pembayaran" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infaq_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS "zakat_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "jenis_zakat" "ZakatType" NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "bukti_pembayaran" TEXT,
    "midtrans_id" TEXT,
    "catatan" TEXT,
    "tanggal_pembayaran" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zakat_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (only if table and constraint don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'infaq_transactions_user_id_fkey'
    ) THEN
        ALTER TABLE "infaq_transactions" ADD CONSTRAINT "infaq_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'infaq_transactions_admin_id_fkey'
    ) THEN
        ALTER TABLE "infaq_transactions" ADD CONSTRAINT "infaq_transactions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'zakat_transactions_user_id_fkey'
    ) THEN
        ALTER TABLE "zakat_transactions" ADD CONSTRAINT "zakat_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'zakat_transactions_admin_id_fkey'
    ) THEN
        ALTER TABLE "zakat_transactions" ADD CONSTRAINT "zakat_transactions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;