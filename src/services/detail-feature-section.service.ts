import { PrismaClient, Locale } from '@prisma/client';
import { extractTranslation, mergeAllTranslations } from '../utils/translation';

const prisma = new PrismaClient();

export class DetailFeatureSectionService {
  /**
   * Get all active detail feature sections for public view (with specific locale)
   */
  static async getPublicSections(locale: Locale, category?: string) {
    const sections: any = await prisma.detailFeatureSection.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        ...(category ? { category } : {}),
      },
      include: {
        translations: {
          where: { locale },
        },
        iconFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
            mimeType: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return sections.map((section: any) => {
      const translation = extractTranslation(section, locale);
      return {
        sectionId: section.sectionId,
        sectionCode: section.sectionCode,
        category: section.category,
        displayOrder: section.displayOrder,
        title: translation?.title ?? '',
        description: translation?.description ?? null,
        icon: section.iconFile
          ? {
              fileId: section.iconFile.fileId,
              filePath: section.iconFile.filePath,
              altText: section.iconFile.altText,
              mimeType: section.iconFile.mimeType,
            }
          : null,
      };
    });
  }

  /**
   * Get all detail feature sections for admin (all locales, with pagination)
   */
  static async getAllSections(page: number = 1, limit: number = 10, category?: string) {
    const skip = (page - 1) * limit;

    const [sections, total] = await Promise.all([
      prisma.detailFeatureSection.findMany({
        where: {
          deletedAt: null,
          ...(category ? { category } : {}),
        },
        include: {
          translations: true,
          iconFile: {
            select: {
              fileId: true,
              filePath: true,
              altText: true,
              mimeType: true,
            },
          },
          creator: {
            select: {
              userId: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.detailFeatureSection.count({
        where: {
          deletedAt: null,
          ...(category ? { category } : {}),
        },
      }),
    ]);

    const sectionsWithMergedTranslations = sections.map((section: any) => ({
      sectionId: section.sectionId,
      sectionCode: section.sectionCode,
      category: section.category,
      displayOrder: section.displayOrder,
      iconFileId: section.iconFileId,
      isActive: section.isActive,
      icon: section.iconFile,
      translations: mergeAllTranslations(section.translations),
      createdBy: section.creator,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
    }));

    return {
      data: sectionsWithMergedTranslations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new detail feature section
   */
  static async createSection(data: {
    category?: string;
    displayOrder: number;
    iconFileId?: number;
    isActive?: boolean;
    translations: {
      id: { title: string; description?: string };
      en: { title: string; description?: string };
    };
    createdBy: number;
  }) {
    const sectionCode = `DFS_${Date.now()}`;

    const section = await prisma.detailFeatureSection.create({
      data: {
        sectionCode,
        category: data.category,
        displayOrder: data.displayOrder,
        iconFileId: data.iconFileId,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: data.translations.id.title,
              description: data.translations.id.description,
            },
            {
              locale: Locale.en,
              title: data.translations.en.title,
              description: data.translations.en.description,
            },
          ],
        },
      },
      include: {
        translations: true,
        iconFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
            mimeType: true,
          },
        },
      },
    });

    return {
      ...section,
      translations: mergeAllTranslations(section.translations),
    };
  }

  /**
   * Update a detail feature section
   */
  static async updateSection(
    sectionId: number,
    data: {
      category?: string;
      displayOrder?: number;
      iconFileId?: number;
      isActive?: boolean;
      translations?: {
        id?: { title?: string; description?: string };
        en?: { title?: string; description?: string };
      };
      updatedBy: number;
    }
  ) {
    const section = await prisma.detailFeatureSection.findUnique({
      where: { sectionId },
      include: { translations: true },
    });

    if (!section || section.deletedAt) {
      throw new Error('Detail feature section not found');
    }

    const updateData: any = {
      updatedBy: data.updatedBy,
    };

    if (data.category !== undefined) updateData.category = data.category;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.iconFileId !== undefined) updateData.iconFileId = data.iconFileId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await prisma.detailFeatureSection.update({
      where: { sectionId },
      data: updateData,
    });

    if (data.translations) {
      for (const locale of [Locale.id, Locale.en]) {
        const translationData = data.translations[locale];
        if (translationData) {
          const existingTranslation = section.translations.find((t: any) => t.locale === locale);

          const updateTranslationData: any = {};
          if (translationData.title !== undefined) updateTranslationData.title = translationData.title;
          if (translationData.description !== undefined)
            updateTranslationData.description = translationData.description;

          if (Object.keys(updateTranslationData).length > 0) {
            if (existingTranslation) {
              await prisma.detailFeatureTranslation.update({
                where: { translationId: existingTranslation.translationId },
                data: updateTranslationData,
              });
            } else {
              await prisma.detailFeatureTranslation.create({
                data: {
                  sectionId,
                  locale,
                  ...updateTranslationData,
                },
              });
            }
          }
        }
      }
    }

    const finalSection = await prisma.detailFeatureSection.findUnique({
      where: { sectionId },
      include: {
        translations: true,
        iconFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
            mimeType: true,
          },
        },
      },
    });

    return {
      ...finalSection,
      translations: mergeAllTranslations(finalSection!.translations),
    };
  }

  /**
   * Delete a detail feature section (soft delete)
   */
  static async deleteSection(sectionId: number) {
    const section = await prisma.detailFeatureSection.findUnique({
      where: { sectionId },
    });

    if (!section || section.deletedAt) {
      throw new Error('Detail feature section not found');
    }

    await prisma.detailFeatureSection.update({
      where: { sectionId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Detail feature section deleted successfully' };
  }
}
