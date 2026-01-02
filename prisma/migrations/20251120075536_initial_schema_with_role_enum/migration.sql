-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Editor', 'Viewer');

-- CreateTable
CREATE TABLE "ADMIN_USER" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Viewer',
    "full_name" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "ADMIN_USER_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "PRICING_PLAN" (
    "plan_id" SERIAL NOT NULL,
    "plan_code" VARCHAR(50) NOT NULL,
    "price_per_user_month" INTEGER NOT NULL,
    "min_users" INTEGER NOT NULL,
    "max_users" INTEGER,
    "display_order" INTEGER NOT NULL,
    "badge_color" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "PRICING_PLAN_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "PRICING_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "plan_name" VARCHAR(255),
    "price_period" VARCHAR(255),
    "user_range" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRICING_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "FEATURE_MASTER" (
    "feature_id" SERIAL NOT NULL,
    "feature_code" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "FEATURE_MASTER_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "FEATURE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "feature_name" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FEATURE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "PLAN_FEATURE_LIST" (
    "list_id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PLAN_FEATURE_LIST_pkey" PRIMARY KEY ("list_id")
);

-- CreateTable
CREATE TABLE "FEATURE_PAGE" (
    "page_id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "page_code" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "hero_image_file_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "FEATURE_PAGE_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "FEATURE_PAGE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "hero_title" VARCHAR(255),
    "hero_subtitle" VARCHAR(255),
    "hero_description" TEXT,
    "about_title" TEXT,
    "about_subtitle" TEXT,
    "about_description1" TEXT,
    "about_description2" TEXT,
    "cta_title" VARCHAR(255),
    "cta_description" TEXT,
    "cta_button_text" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FEATURE_PAGE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "FEATURE_PAGE_ITEM" (
    "item_id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "image_file_id" INTEGER,
    "item_type" VARCHAR(50),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FEATURE_PAGE_ITEM_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "FEATURE_PAGE_ITEM_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "short_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FEATURE_PAGE_ITEM_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "DETAIL_FEATURE_SECTION" (
    "section_id" SERIAL NOT NULL,
    "section_code" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "display_order" INTEGER NOT NULL,
    "icon_file_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "DETAIL_FEATURE_SECTION_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "DETAIL_FEATURE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DETAIL_FEATURE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "CONTENT_SECTION" (
    "section_id" SERIAL NOT NULL,
    "section_type" VARCHAR(100) NOT NULL,
    "section_key" VARCHAR(100) NOT NULL,
    "page_location" VARCHAR(50),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "CONTENT_SECTION_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "CONTENT_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "description" TEXT,
    "content" TEXT,
    "additional_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONTENT_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "CONTENT_MEDIA" (
    "content_media_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "media_type" VARCHAR(50),
    "usage" VARCHAR(50),
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONTENT_MEDIA_pkey" PRIMARY KEY ("content_media_id")
);

-- CreateTable
CREATE TABLE "TESTIMONIAL" (
    "testimonial_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "company" VARCHAR(255),
    "photo_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "rating" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "TESTIMONIAL_pkey" PRIMARY KEY ("testimonial_id")
);

-- CreateTable
CREATE TABLE "TESTIMONIAL_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "testimonial_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "quote" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TESTIMONIAL_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY" (
    "industry_id" SERIAL NOT NULL,
    "industry_code" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "INDUSTRY_pkey" PRIMARY KEY ("industry_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "industry_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "intro_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_PROBLEM" (
    "problem_id" SERIAL NOT NULL,
    "industry_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_PROBLEM_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_PROBLEM_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_PROBLEM_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_SOLUTION" (
    "solution_id" SERIAL NOT NULL,
    "industry_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_SOLUTION_pkey" PRIMARY KEY ("solution_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_SOLUTION_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "solution_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_SOLUTION_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "INDUSTRY_MEDIA" (
    "industry_media_id" SERIAL NOT NULL,
    "industry_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "media_type" VARCHAR(50),
    "usage" VARCHAR(50),
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INDUSTRY_MEDIA_pkey" PRIMARY KEY ("industry_media_id")
);

-- CreateTable
CREATE TABLE "BENEFIT_STAT" (
    "stat_id" SERIAL NOT NULL,
    "stat_code" VARCHAR(100) NOT NULL,
    "stat_value" VARCHAR(50),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "BENEFIT_STAT_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "BENEFIT_STAT_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "label" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BENEFIT_STAT_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "PROCESS_STEP" (
    "step_id" SERIAL NOT NULL,
    "step_code" VARCHAR(100) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "image_file_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "PROCESS_STEP_pkey" PRIMARY KEY ("step_id")
);

-- CreateTable
CREATE TABLE "PROCESS_STEP_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "step_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PROCESS_STEP_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "ERP_BENEFIT" (
    "benefit_id" SERIAL NOT NULL,
    "benefit_code" VARCHAR(100) NOT NULL,
    "image_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "ERP_BENEFIT_pkey" PRIMARY KEY ("benefit_id")
);

-- CreateTable
CREATE TABLE "ERP_BENEFIT_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "benefit_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ERP_BENEFIT_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "PARTNER" (
    "partner_id" SERIAL NOT NULL,
    "partner_name" VARCHAR(255) NOT NULL,
    "website_url" VARCHAR(255),
    "logo_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "PARTNER_pkey" PRIMARY KEY ("partner_id")
);

-- CreateTable
CREATE TABLE "PARTNER_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PARTNER_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "ABOUT_CARD" (
    "card_id" SERIAL NOT NULL,
    "card_code" VARCHAR(100) NOT NULL,
    "card_link" VARCHAR(255),
    "image_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "ABOUT_CARD_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "ABOUT_CARD_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ABOUT_CARD_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "ADVANCED_FEATURE" (
    "feature_id" SERIAL NOT NULL,
    "feature_code" VARCHAR(100) NOT NULL,
    "image_file_id" INTEGER,
    "link_url" VARCHAR(255),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "ADVANCED_FEATURE_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "ADVANCED_FEATURE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ADVANCED_FEATURE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "FAQ_CATEGORY" (
    "category_id" SERIAL NOT NULL,
    "category_code" VARCHAR(100) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "FAQ_CATEGORY_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "FAQ_CATEGORY_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "category_name" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_CATEGORY_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "faq_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("faq_id")
);

-- CreateTable
CREATE TABLE "FAQ_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "faq_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "KELOLA_AJA_FEATURE" (
    "feature_id" SERIAL NOT NULL,
    "feature_code" VARCHAR(100) NOT NULL,
    "icon_name" VARCHAR(100),
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "KELOLA_AJA_FEATURE_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "KELOLA_AJA_FEATURE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KELOLA_AJA_FEATURE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "MEDIA_FILE" (
    "file_id" SERIAL NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(100),
    "mime_type" VARCHAR(100),
    "file_size" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" VARCHAR(255),
    "storage_type" VARCHAR(50),
    "storage_url" VARCHAR(255),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "uploaded_by" INTEGER,

    CONSTRAINT "MEDIA_FILE_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "VISITOR" (
    "visitor_id" SERIAL NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "referrer" TEXT,
    "country_code" VARCHAR(2),
    "city" VARCHAR(100),
    "device_type" VARCHAR(50),
    "browser" VARCHAR(50),
    "os" VARCHAR(50),
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "first_visit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_visit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visit_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "VISITOR_pkey" PRIMARY KEY ("visitor_id")
);

-- CreateTable
CREATE TABLE "PAGE_VIEW" (
    "view_id" SERIAL NOT NULL,
    "visitor_id" INTEGER NOT NULL,
    "page_path" VARCHAR(255) NOT NULL,
    "page_title" VARCHAR(255),
    "referrer" VARCHAR(255),
    "duration_seconds" INTEGER,
    "scroll_depth" INTEGER,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PAGE_VIEW_pkey" PRIMARY KEY ("view_id")
);

-- CreateTable
CREATE TABLE "PAGE_VIEW_EVENT" (
    "event_id" SERIAL NOT NULL,
    "view_id" INTEGER NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "event_target" VARCHAR(255),
    "event_data" JSONB,
    "event_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PAGE_VIEW_EVENT_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "CONTACT_SUBMISSION" (
    "submission_id" SERIAL NOT NULL,
    "visitor_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "message" TEXT NOT NULL,
    "source" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'pending',
    "admin_notes" TEXT,
    "assigned_to" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contacted_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CONTACT_SUBMISSION_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "AUDIT_LOG" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AUDIT_LOG_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "SITE_CONFIG" (
    "config_id" SERIAL NOT NULL,
    "config_key" VARCHAR(100) NOT NULL,
    "config_value" TEXT,
    "value_type" VARCHAR(50),
    "category" VARCHAR(50),
    "description" TEXT,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SITE_CONFIG_pkey" PRIMARY KEY ("config_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_USER_username_key" ON "ADMIN_USER"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_USER_email_key" ON "ADMIN_USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PRICING_PLAN_plan_code_key" ON "PRICING_PLAN"("plan_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_pricing_translation" ON "PRICING_TRANSLATION"("plan_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "FEATURE_MASTER_feature_code_key" ON "FEATURE_MASTER"("feature_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_feature_translation" ON "FEATURE_TRANSLATION"("feature_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_plan_feature" ON "PLAN_FEATURE_LIST"("plan_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "FEATURE_PAGE_page_code_key" ON "FEATURE_PAGE"("page_code");

-- CreateIndex
CREATE UNIQUE INDEX "FEATURE_PAGE_slug_key" ON "FEATURE_PAGE"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_feature_page_translation" ON "FEATURE_PAGE_TRANSLATION"("page_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_feature_page_item_translation" ON "FEATURE_PAGE_ITEM_TRANSLATION"("item_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "DETAIL_FEATURE_SECTION_section_code_key" ON "DETAIL_FEATURE_SECTION"("section_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_detail_feature_translation" ON "DETAIL_FEATURE_TRANSLATION"("section_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "CONTENT_SECTION_section_type_key" ON "CONTENT_SECTION"("section_type");

-- CreateIndex
CREATE UNIQUE INDEX "CONTENT_SECTION_section_key_key" ON "CONTENT_SECTION"("section_key");

-- CreateIndex
CREATE UNIQUE INDEX "unique_content_translation" ON "CONTENT_TRANSLATION"("section_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_testimonial_translation" ON "TESTIMONIAL_TRANSLATION"("testimonial_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "INDUSTRY_industry_code_key" ON "INDUSTRY"("industry_code");

-- CreateIndex
CREATE UNIQUE INDEX "INDUSTRY_slug_key" ON "INDUSTRY"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_industry_translation" ON "INDUSTRY_TRANSLATION"("industry_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_industry_problem_translation" ON "INDUSTRY_PROBLEM_TRANSLATION"("problem_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_industry_solution_translation" ON "INDUSTRY_SOLUTION_TRANSLATION"("solution_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "BENEFIT_STAT_stat_code_key" ON "BENEFIT_STAT"("stat_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_benefit_stat_translation" ON "BENEFIT_STAT_TRANSLATION"("stat_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PROCESS_STEP_step_code_key" ON "PROCESS_STEP"("step_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_process_step_translation" ON "PROCESS_STEP_TRANSLATION"("step_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ERP_BENEFIT_benefit_code_key" ON "ERP_BENEFIT"("benefit_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_erp_benefit_translation" ON "ERP_BENEFIT_TRANSLATION"("benefit_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PARTNER_partner_name_key" ON "PARTNER"("partner_name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_partner_translation" ON "PARTNER_TRANSLATION"("partner_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ABOUT_CARD_card_code_key" ON "ABOUT_CARD"("card_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_about_card_translation" ON "ABOUT_CARD_TRANSLATION"("card_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ADVANCED_FEATURE_feature_code_key" ON "ADVANCED_FEATURE"("feature_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_advanced_feature_translation" ON "ADVANCED_FEATURE_TRANSLATION"("feature_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_CATEGORY_category_code_key" ON "FAQ_CATEGORY"("category_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_faq_category_translation" ON "FAQ_CATEGORY_TRANSLATION"("category_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "unique_faq_translation" ON "FAQ_TRANSLATION"("faq_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "KELOLA_AJA_FEATURE_feature_code_key" ON "KELOLA_AJA_FEATURE"("feature_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_kelola_aja_feature_translation" ON "KELOLA_AJA_FEATURE_TRANSLATION"("feature_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SITE_CONFIG_config_key_key" ON "SITE_CONFIG"("config_key");

-- AddForeignKey
ALTER TABLE "ADMIN_USER" ADD CONSTRAINT "ADMIN_USER_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRICING_PLAN" ADD CONSTRAINT "PRICING_PLAN_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRICING_PLAN" ADD CONSTRAINT "PRICING_PLAN_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRICING_TRANSLATION" ADD CONSTRAINT "PRICING_TRANSLATION_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "PRICING_PLAN"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_MASTER" ADD CONSTRAINT "FEATURE_MASTER_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_MASTER" ADD CONSTRAINT "FEATURE_MASTER_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_TRANSLATION" ADD CONSTRAINT "FEATURE_TRANSLATION_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "FEATURE_MASTER"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PLAN_FEATURE_LIST" ADD CONSTRAINT "PLAN_FEATURE_LIST_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "PRICING_PLAN"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PLAN_FEATURE_LIST" ADD CONSTRAINT "PLAN_FEATURE_LIST_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "FEATURE_MASTER"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE" ADD CONSTRAINT "FEATURE_PAGE_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE" ADD CONSTRAINT "FEATURE_PAGE_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE" ADD CONSTRAINT "FEATURE_PAGE_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "FEATURE_MASTER"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE" ADD CONSTRAINT "FEATURE_PAGE_hero_image_file_id_fkey" FOREIGN KEY ("hero_image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE_TRANSLATION" ADD CONSTRAINT "FEATURE_PAGE_TRANSLATION_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "FEATURE_PAGE"("page_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE_ITEM" ADD CONSTRAINT "FEATURE_PAGE_ITEM_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "FEATURE_PAGE"("page_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE_ITEM" ADD CONSTRAINT "FEATURE_PAGE_ITEM_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEATURE_PAGE_ITEM_TRANSLATION" ADD CONSTRAINT "FEATURE_PAGE_ITEM_TRANSLATION_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "FEATURE_PAGE_ITEM"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETAIL_FEATURE_SECTION" ADD CONSTRAINT "DETAIL_FEATURE_SECTION_icon_file_id_fkey" FOREIGN KEY ("icon_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETAIL_FEATURE_SECTION" ADD CONSTRAINT "DETAIL_FEATURE_SECTION_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETAIL_FEATURE_SECTION" ADD CONSTRAINT "DETAIL_FEATURE_SECTION_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETAIL_FEATURE_TRANSLATION" ADD CONSTRAINT "DETAIL_FEATURE_TRANSLATION_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "DETAIL_FEATURE_SECTION"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENT_SECTION" ADD CONSTRAINT "CONTENT_SECTION_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENT_SECTION" ADD CONSTRAINT "CONTENT_SECTION_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENT_TRANSLATION" ADD CONSTRAINT "CONTENT_TRANSLATION_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "CONTENT_SECTION"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENT_MEDIA" ADD CONSTRAINT "CONTENT_MEDIA_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "CONTENT_SECTION"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENT_MEDIA" ADD CONSTRAINT "CONTENT_MEDIA_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TESTIMONIAL" ADD CONSTRAINT "TESTIMONIAL_photo_file_id_fkey" FOREIGN KEY ("photo_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TESTIMONIAL" ADD CONSTRAINT "TESTIMONIAL_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TESTIMONIAL" ADD CONSTRAINT "TESTIMONIAL_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TESTIMONIAL_TRANSLATION" ADD CONSTRAINT "TESTIMONIAL_TRANSLATION_testimonial_id_fkey" FOREIGN KEY ("testimonial_id") REFERENCES "TESTIMONIAL"("testimonial_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY" ADD CONSTRAINT "INDUSTRY_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY" ADD CONSTRAINT "INDUSTRY_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_TRANSLATION" ADD CONSTRAINT "INDUSTRY_TRANSLATION_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "INDUSTRY"("industry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_PROBLEM" ADD CONSTRAINT "INDUSTRY_PROBLEM_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "INDUSTRY"("industry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_PROBLEM_TRANSLATION" ADD CONSTRAINT "INDUSTRY_PROBLEM_TRANSLATION_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "INDUSTRY_PROBLEM"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_SOLUTION" ADD CONSTRAINT "INDUSTRY_SOLUTION_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "INDUSTRY"("industry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_SOLUTION_TRANSLATION" ADD CONSTRAINT "INDUSTRY_SOLUTION_TRANSLATION_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "INDUSTRY_SOLUTION"("solution_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_MEDIA" ADD CONSTRAINT "INDUSTRY_MEDIA_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "INDUSTRY"("industry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INDUSTRY_MEDIA" ADD CONSTRAINT "INDUSTRY_MEDIA_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BENEFIT_STAT" ADD CONSTRAINT "BENEFIT_STAT_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BENEFIT_STAT" ADD CONSTRAINT "BENEFIT_STAT_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BENEFIT_STAT_TRANSLATION" ADD CONSTRAINT "BENEFIT_STAT_TRANSLATION_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "BENEFIT_STAT"("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PROCESS_STEP" ADD CONSTRAINT "PROCESS_STEP_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PROCESS_STEP" ADD CONSTRAINT "PROCESS_STEP_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PROCESS_STEP" ADD CONSTRAINT "PROCESS_STEP_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PROCESS_STEP_TRANSLATION" ADD CONSTRAINT "PROCESS_STEP_TRANSLATION_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "PROCESS_STEP"("step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERP_BENEFIT" ADD CONSTRAINT "ERP_BENEFIT_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERP_BENEFIT" ADD CONSTRAINT "ERP_BENEFIT_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERP_BENEFIT" ADD CONSTRAINT "ERP_BENEFIT_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERP_BENEFIT_TRANSLATION" ADD CONSTRAINT "ERP_BENEFIT_TRANSLATION_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "ERP_BENEFIT"("benefit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PARTNER" ADD CONSTRAINT "PARTNER_logo_file_id_fkey" FOREIGN KEY ("logo_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PARTNER" ADD CONSTRAINT "PARTNER_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PARTNER" ADD CONSTRAINT "PARTNER_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PARTNER_TRANSLATION" ADD CONSTRAINT "PARTNER_TRANSLATION_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "PARTNER"("partner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABOUT_CARD" ADD CONSTRAINT "ABOUT_CARD_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABOUT_CARD" ADD CONSTRAINT "ABOUT_CARD_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABOUT_CARD" ADD CONSTRAINT "ABOUT_CARD_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABOUT_CARD_TRANSLATION" ADD CONSTRAINT "ABOUT_CARD_TRANSLATION_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "ABOUT_CARD"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADVANCED_FEATURE" ADD CONSTRAINT "ADVANCED_FEATURE_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADVANCED_FEATURE" ADD CONSTRAINT "ADVANCED_FEATURE_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADVANCED_FEATURE" ADD CONSTRAINT "ADVANCED_FEATURE_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADVANCED_FEATURE_TRANSLATION" ADD CONSTRAINT "ADVANCED_FEATURE_TRANSLATION_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "ADVANCED_FEATURE"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ_CATEGORY" ADD CONSTRAINT "FAQ_CATEGORY_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ_CATEGORY" ADD CONSTRAINT "FAQ_CATEGORY_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ_CATEGORY_TRANSLATION" ADD CONSTRAINT "FAQ_CATEGORY_TRANSLATION_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "FAQ_CATEGORY"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "FAQ_CATEGORY"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ_TRANSLATION" ADD CONSTRAINT "FAQ_TRANSLATION_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "FAQ"("faq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KELOLA_AJA_FEATURE" ADD CONSTRAINT "KELOLA_AJA_FEATURE_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KELOLA_AJA_FEATURE" ADD CONSTRAINT "KELOLA_AJA_FEATURE_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KELOLA_AJA_FEATURE_TRANSLATION" ADD CONSTRAINT "KELOLA_AJA_FEATURE_TRANSLATION_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "KELOLA_AJA_FEATURE"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MEDIA_FILE" ADD CONSTRAINT "MEDIA_FILE_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAGE_VIEW" ADD CONSTRAINT "PAGE_VIEW_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "VISITOR"("visitor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAGE_VIEW_EVENT" ADD CONSTRAINT "PAGE_VIEW_EVENT_view_id_fkey" FOREIGN KEY ("view_id") REFERENCES "PAGE_VIEW"("view_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTACT_SUBMISSION" ADD CONSTRAINT "CONTACT_SUBMISSION_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "VISITOR"("visitor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTACT_SUBMISSION" ADD CONSTRAINT "CONTACT_SUBMISSION_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "ADMIN_USER"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AUDIT_LOG" ADD CONSTRAINT "AUDIT_LOG_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SITE_CONFIG" ADD CONSTRAINT "SITE_CONFIG_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
