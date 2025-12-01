-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance');

-- CreateEnum
CREATE TYPE "JobLevel" AS ENUM ('entry_level', 'junior', 'mid_level', 'senior', 'lead', 'manager', 'director', 'executive');

-- CreateEnum
CREATE TYPE "WorkLocation" AS ENUM ('on_site', 'remote', 'hybrid');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn', 'accepted');

-- CreateTable
CREATE TABLE "JOB_POSTING" (
    "job_id" SERIAL NOT NULL,
    "job_code" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "department" VARCHAR(100),
    "job_type" "JobType" NOT NULL,
    "job_level" "JobLevel" NOT NULL,
    "work_location" "WorkLocation" NOT NULL,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" VARCHAR(10) DEFAULT 'IDR',
    "salary_period" VARCHAR(20) DEFAULT 'monthly',
    "show_salary" BOOLEAN NOT NULL DEFAULT false,
    "positions" INTEGER NOT NULL DEFAULT 1,
    "experience_years" INTEGER,
    "application_deadline" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "application_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "JOB_POSTING_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "JOB_POSTING_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "title" VARCHAR(255) NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "qualifications" TEXT,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_POSTING_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "JOB_REQUIREMENT" (
    "requirement_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_REQUIREMENT_pkey" PRIMARY KEY ("requirement_id")
);

-- CreateTable
CREATE TABLE "JOB_REQUIREMENT_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "requirement_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "requirement" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_REQUIREMENT_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "JOB_RESPONSIBILITY" (
    "responsibility_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_RESPONSIBILITY_pkey" PRIMARY KEY ("responsibility_id")
);

-- CreateTable
CREATE TABLE "JOB_RESPONSIBILITY_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "responsibility_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "responsibility" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_RESPONSIBILITY_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "JOB_BENEFIT" (
    "benefit_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "icon_name" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_BENEFIT_pkey" PRIMARY KEY ("benefit_id")
);

-- CreateTable
CREATE TABLE "JOB_BENEFIT_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "benefit_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "benefit" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JOB_BENEFIT_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "JOB_APPLICATION" (
    "application_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "applicant_name" VARCHAR(255) NOT NULL,
    "applicant_email" VARCHAR(255) NOT NULL,
    "applicant_phone" VARCHAR(50),
    "current_company" VARCHAR(255),
    "current_position" VARCHAR(255),
    "years_of_experience" INTEGER,
    "expected_salary" INTEGER,
    "salary_currency" VARCHAR(10) DEFAULT 'IDR',
    "available_from" DATE,
    "cover_letter" TEXT,
    "cv_file_id" INTEGER,
    "portfolio_url" VARCHAR(255),
    "linkedin_url" VARCHAR(255),
    "github_url" VARCHAR(255),
    "referral_source" VARCHAR(100),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "rating" INTEGER,
    "admin_notes" TEXT,
    "rejection_reason" TEXT,
    "assigned_to" INTEGER,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "interviewed_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "JOB_APPLICATION_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JOB_POSTING_job_code_key" ON "JOB_POSTING"("job_code");

-- CreateIndex
CREATE UNIQUE INDEX "JOB_POSTING_slug_key" ON "JOB_POSTING"("slug");

-- CreateIndex
CREATE INDEX "JOB_POSTING_is_active_published_at_idx" ON "JOB_POSTING"("is_active", "published_at");

-- CreateIndex
CREATE INDEX "JOB_POSTING_job_type_job_level_idx" ON "JOB_POSTING"("job_type", "job_level");

-- CreateIndex
CREATE INDEX "JOB_POSTING_work_location_idx" ON "JOB_POSTING"("work_location");

-- CreateIndex
CREATE UNIQUE INDEX "unique_job_posting_translation" ON "JOB_POSTING_TRANSLATION"("job_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_job_requirement_translation" ON "JOB_REQUIREMENT_TRANSLATION"("requirement_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_job_responsibility_translation" ON "JOB_RESPONSIBILITY_TRANSLATION"("responsibility_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_job_benefit_translation" ON "JOB_BENEFIT_TRANSLATION"("benefit_id", "locale");

-- CreateIndex
CREATE INDEX "JOB_APPLICATION_job_id_status_idx" ON "JOB_APPLICATION"("job_id", "status");

-- CreateIndex
CREATE INDEX "JOB_APPLICATION_applicant_email_idx" ON "JOB_APPLICATION"("applicant_email");

-- CreateIndex
CREATE INDEX "JOB_APPLICATION_status_created_at_idx" ON "JOB_APPLICATION"("status", "created_at");

-- AddForeignKey
ALTER TABLE "JOB_POSTING" ADD CONSTRAINT "JOB_POSTING_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_POSTING" ADD CONSTRAINT "JOB_POSTING_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_POSTING_TRANSLATION" ADD CONSTRAINT "JOB_POSTING_TRANSLATION_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JOB_POSTING"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_REQUIREMENT" ADD CONSTRAINT "JOB_REQUIREMENT_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JOB_POSTING"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_REQUIREMENT_TRANSLATION" ADD CONSTRAINT "JOB_REQUIREMENT_TRANSLATION_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "JOB_REQUIREMENT"("requirement_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_RESPONSIBILITY" ADD CONSTRAINT "JOB_RESPONSIBILITY_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JOB_POSTING"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_RESPONSIBILITY_TRANSLATION" ADD CONSTRAINT "JOB_RESPONSIBILITY_TRANSLATION_responsibility_id_fkey" FOREIGN KEY ("responsibility_id") REFERENCES "JOB_RESPONSIBILITY"("responsibility_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_BENEFIT" ADD CONSTRAINT "JOB_BENEFIT_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JOB_POSTING"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_BENEFIT_TRANSLATION" ADD CONSTRAINT "JOB_BENEFIT_TRANSLATION_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "JOB_BENEFIT"("benefit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_APPLICATION" ADD CONSTRAINT "JOB_APPLICATION_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JOB_POSTING"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_APPLICATION" ADD CONSTRAINT "JOB_APPLICATION_cv_file_id_fkey" FOREIGN KEY ("cv_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JOB_APPLICATION" ADD CONSTRAINT "JOB_APPLICATION_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "ADMIN_USER"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
