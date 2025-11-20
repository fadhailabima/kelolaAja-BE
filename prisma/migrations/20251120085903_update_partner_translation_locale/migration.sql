/*
  Warnings:

  - The `locale` column on the `PARTNER_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PARTNER_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_partner_translation" ON "PARTNER_TRANSLATION"("partner_id", "locale");
