/*
  Warnings:

  - The `locale` column on the `FAQ_CATEGORY_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `FAQ_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FAQ_CATEGORY_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "FAQ_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_faq_category_translation" ON "FAQ_CATEGORY_TRANSLATION"("category_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_faq_translation" ON "FAQ_TRANSLATION"("faq_id", "locale");
