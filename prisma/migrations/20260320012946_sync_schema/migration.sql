-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "farmerName" TEXT,
ADD COLUMN     "harvestDate" TIMESTAMP(3),
ADD COLUMN     "origin" TEXT;

-- CreateTable
CREATE TABLE "HealthCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleep" INTEGER NOT NULL,
    "digestion" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthCheckIn_userId_createdAt_idx" ON "HealthCheckIn"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "HealthCheckIn" ADD CONSTRAINT "HealthCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
