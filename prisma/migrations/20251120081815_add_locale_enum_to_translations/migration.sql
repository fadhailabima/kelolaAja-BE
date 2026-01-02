/*
  Warnings:

  - The `locale` column on the `FEATURE_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `PRICING_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('id', 'en');

-- AlterTable
ALTER TABLE "FEATURE_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "PRICING_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_feature_translation" ON "FEATURE_TRANSLATION"("feature_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_pricing_translation" ON "PRICING_TRANSLATION"("plan_id", "locale");
