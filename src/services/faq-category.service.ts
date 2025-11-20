import { prisma } from '../utils/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import { Locale } from '@prisma/client';
import { mergeAllTranslations } from '../utils/translation';

export class FAQCategoryService {
  /**
   * Get all active FAQ categories (Public)
   */
  static async getPublicCategories(locale: Locale) {
    const categories: any = await prisma.fAQCategory.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: {
          where: { locale },
        },
        faqs: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          select: {
            faqId: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return categories.map((category: any) => {
      const translation = category.translations[0] || {};
      return {
        categoryId: category.categoryId,
        categoryCode: category.categoryCode,
        displayOrder: category.displayOrder,
        categoryName: translation.categoryName || '',
        faqCount: category.faqs.length,
      };
    });
  }

  /**
   * Get all categories with all translations (Admin)
   */
  static async getAllCategories(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { categoryCode: { contains: search, mode: 'insensitive' } },
        { translations: { some: { categoryName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [total, categories]: any = await Promise.all([
      prisma.fAQCategory.count({ where }),
      prisma.fAQCategory.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: 'asc' },
          },
          faqs: {
            select: {
              faqId: true,
            },
          },
          creator: {
            select: {
              userId: true,
              username: true,
              email: true,
            },
          },
          updater: {
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
    ]);

    const result = categories.map((category: any) => ({
      categoryId: category.categoryId,
      categoryCode: category.categoryCode,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      creator: category.creator,
      updater: category.updater,
      faqCount: category.faqs.length,
      translations: mergeAllTranslations(category.translations),
    }));

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create new FAQ category
   */
  static async createCategory(data: any, userId: number) {
    const { categoryCode, displayOrder, translations } = data;

    if (!categoryCode || displayOrder === undefined) {
      throw new ValidationError('categoryCode and displayOrder are required');
    }

    if (!translations || !translations.id) {
      throw new ValidationError('Indonesian translation (id) is required');
    }

    // Check duplicate
    const existing = await prisma.fAQCategory.findUnique({
      where: { categoryCode },
    });

    if (existing) {
      throw new ValidationError('Category code already exists');
    }

    const category: any = await prisma.fAQCategory.create({
      data: {
        categoryCode,
        displayOrder,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              categoryName: translations.id.categoryName,
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
                    categoryName: translations.en.categoryName,
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        translations: true,
        creator: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      ...category,
      translations: mergeAllTranslations(category.translations),
    };
  }

  /**
   * Update FAQ category
   */
  static async updateCategory(categoryId: number, data: any, userId: number) {
    const { categoryCode, displayOrder, isActive, translations } = data;

    const existing = await prisma.fAQCategory.findUnique({
      where: { categoryId },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError('FAQ category not found');
    }

    if (categoryCode && categoryCode !== existing.categoryCode) {
      const duplicate = await prisma.fAQCategory.findUnique({
        where: { categoryCode },
      });

      if (duplicate) {
        throw new ValidationError('Category code already exists');
      }
    }

    const updateData: any = { updatedBy: userId };

    if (categoryCode) updateData.categoryCode = categoryCode;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.fAQCategory.update({
      where: { categoryId },
      data: updateData,
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.fAQCategoryTranslation.upsert({
            where: {
              categoryId_locale: {
                categoryId,
                locale,
              },
            },
            create: {
              categoryId,
              locale,
              categoryName: translations[locale].categoryName,
            },
            update: {
              categoryName: translations[locale].categoryName,
            },
          });
        }
      }
    }

    const updated: any = await prisma.fAQCategory.findUnique({
      where: { categoryId },
      include: {
        translations: true,
        updater: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      ...updated,
      translations: mergeAllTranslations(updated.translations),
    };
  }

  /**
   * Soft delete FAQ category
   */
  static async deleteCategory(categoryId: number, userId: number) {
    const category = await prisma.fAQCategory.findUnique({
      where: { categoryId },
      include: {
        faqs: {
          where: { deletedAt: null },
        },
      },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundError('FAQ category not found');
    }

    if (category.faqs.length > 0) {
      throw new ValidationError(
        'Cannot delete category with existing FAQs. Please delete or move FAQs first.'
      );
    }

    await prisma.fAQCategory.update({
      where: { categoryId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId,
      },
    });
  }
}
