-- CreateTable
CREATE TABLE "ZakatConfig" (
    "id" TEXT NOT NULL,
    "jenisZakat" "ZakatType" NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZakatConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZakatConfig_jenisZakat_key_key" ON "ZakatConfig"("jenisZakat", "key");
