/*
  Warnings:

  - The `locale` column on the `BENEFIT_STAT_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `ERP_BENEFIT_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locale` column on the `PROCESS_STEP_TRANSLATION` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BENEFIT_STAT_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "ERP_BENEFIT_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- AlterTable
ALTER TABLE "PROCESS_STEP_TRANSLATION" DROP COLUMN "locale",
ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'id';

-- CreateIndex
CREATE UNIQUE INDEX "unique_benefit_stat_translation" ON "BENEFIT_STAT_TRANSLATION"("stat_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_erp_benefit_translation" ON "ERP_BENEFIT_TRANSLATION"("benefit_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_process_step_translation" ON "PROCESS_STEP_TRANSLATION"("step_id", "locale");
