/*
  Warnings:

  - The `locale` column on the `CONTENT_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `DETAIL_FEATURE_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CONTENT_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "DETAIL_FEATURE_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_content_translation" ON "CONTENT_TRANSLATION"("section_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_detail_feature_translation" ON "DETAIL_FEATURE_TRANSLATION"("section_id", "locale");
