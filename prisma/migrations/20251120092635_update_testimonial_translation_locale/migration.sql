/*
  Warnings:

  - The `locale` column on the `TESTIMONIAL_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TESTIMONIAL_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_testimonial_translation" ON "TESTIMONIAL_TRANSLATION"("testimonial_id", "locale");
