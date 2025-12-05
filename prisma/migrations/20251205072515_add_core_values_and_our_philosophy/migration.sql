-- CreateTable
CREATE TABLE "CORE_VALUE" (
    "value_id" SERIAL NOT NULL,
    "value_code" VARCHAR(100) NOT NULL,
    "icon_name" VARCHAR(100),
    "image_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "CORE_VALUE_pkey" PRIMARY KEY ("value_id")
);

-- CreateTable
CREATE TABLE "CORE_VALUE_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "value_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CORE_VALUE_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "OUR_PHILOSOPHY" (
    "philosophy_id" SERIAL NOT NULL,
    "philosophy_code" VARCHAR(100) NOT NULL,
    "icon_name" VARCHAR(100),
    "image_file_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "OUR_PHILOSOPHY_pkey" PRIMARY KEY ("philosophy_id")
);

-- CreateTable
CREATE TABLE "OUR_PHILOSOPHY_TRANSLATION" (
    "translation_id" SERIAL NOT NULL,
    "philosophy_id" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'id',
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OUR_PHILOSOPHY_TRANSLATION_pkey" PRIMARY KEY ("translation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CORE_VALUE_value_code_key" ON "CORE_VALUE"("value_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_core_value_translation" ON "CORE_VALUE_TRANSLATION"("value_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "OUR_PHILOSOPHY_philosophy_code_key" ON "OUR_PHILOSOPHY"("philosophy_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_our_philosophy_translation" ON "OUR_PHILOSOPHY_TRANSLATION"("philosophy_id", "locale");

-- AddForeignKey
ALTER TABLE "CORE_VALUE" ADD CONSTRAINT "CORE_VALUE_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CORE_VALUE" ADD CONSTRAINT "CORE_VALUE_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CORE_VALUE" ADD CONSTRAINT "CORE_VALUE_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CORE_VALUE_TRANSLATION" ADD CONSTRAINT "CORE_VALUE_TRANSLATION_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "CORE_VALUE"("value_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OUR_PHILOSOPHY" ADD CONSTRAINT "OUR_PHILOSOPHY_image_file_id_fkey" FOREIGN KEY ("image_file_id") REFERENCES "MEDIA_FILE"("file_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OUR_PHILOSOPHY" ADD CONSTRAINT "OUR_PHILOSOPHY_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OUR_PHILOSOPHY" ADD CONSTRAINT "OUR_PHILOSOPHY_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "ADMIN_USER"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OUR_PHILOSOPHY_TRANSLATION" ADD CONSTRAINT "OUR_PHILOSOPHY_TRANSLATION_philosophy_id_fkey" FOREIGN KEY ("philosophy_id") REFERENCES "OUR_PHILOSOPHY"("philosophy_id") ON DELETE RESTRICT ON UPDATE CASCADE;
