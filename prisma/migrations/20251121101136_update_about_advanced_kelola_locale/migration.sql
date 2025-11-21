/*
  Warnings:

  - The `locale` column on the `ABOUT_CARD_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `ADVANCED_FEATURE_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `KELOLA_AJA_FEATURE_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ABOUT_CARD_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "ADVANCED_FEATURE_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "KELOLA_AJA_FEATURE_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_about_card_translation" ON "ABOUT_CARD_TRANSLATION"("card_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_advanced_feature_translation" ON "ADVANCED_FEATURE_TRANSLATION"("feature_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_kelola_aja_feature_translation" ON "KELOLA_AJA_FEATURE_TRANSLATION"("feature_id", "locale");
