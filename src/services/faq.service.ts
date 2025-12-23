import { prisma } from '../utils/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import { Locale } from '@prisma/client';
import { mergeAllTranslations } from '../utils/translation';

export class FAQService {
  /**
   * Get all active FAQs (Public)
   */
  static async getPublicFAQs(_locale: Locale, categoryId?: number) {
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const faqs: any = await prisma.fAQ.findMany({
      where,
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return faqs.map((faq: any) => {
      return {
        faqId: faq.faqId,
        displayOrder: faq.displayOrder,
        translations: mergeAllTranslations(faq.translations),
        category: faq.category
          ? {
              categoryId: faq.category.categoryId,
              categoryCode: faq.category.categoryCode,
              translations: mergeAllTranslations(faq.category.translations),
            }
          : null,
      };
    });
  }

  /**
   * Get FAQs grouped by category (Public)
   */
  static async getPublicFAQsByCategory(_locale: Locale) {
    const categories: any = await prisma.fAQCategory.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        faqs: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          include: {
            translations: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return categories.map((category: any) => {
      return {
        categoryId: category.categoryId,
        categoryCode: category.categoryCode,
        translations: mergeAllTranslations(category.translations),
        displayOrder: category.displayOrder,
        faqs: category.faqs.map((faq: any) => {
          return {
            faqId: faq.faqId,
            displayOrder: faq.displayOrder,
            translations: mergeAllTranslations(faq.translations),
          };
        }),
      };
    });
  }

  /**
   * Get single public FAQ by ID
   */
  static async getPublicFAQById(faqId: number, _locale: Locale) {
    const faq: any = await prisma.fAQ.findFirst({
      where: {
        faqId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    return {
      faqId: faq.faqId,
      displayOrder: faq.displayOrder,
      translations: mergeAllTranslations(faq.translations),
      category: faq.category
        ? {
            categoryId: faq.category.categoryId,
            categoryCode: faq.category.categoryCode,
            translations: mergeAllTranslations(faq.category.translations),
          }
        : null,
    };
  }

  /**
   * Get all FAQs with all translations (Admin)
   */
  static async getAllFAQs(
    page: number,
    limit: number,
    search?: string,
    categoryId?: number,
    isActive?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { translations: { some: { question: { contains: search, mode: 'insensitive' } } } },
        { translations: { some: { answer: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [total, faqs]: any = await Promise.all([
      prisma.fAQ.count({ where }),
      prisma.fAQ.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: 'asc' },
          },
          category: {
            include: {
              translations: true,
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

    const result = faqs.map((faq: any) => ({
      faqId: faq.faqId,
      categoryId: faq.categoryId,
      displayOrder: faq.displayOrder,
      isActive: faq.isActive,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt,
      category: faq.category
        ? {
            categoryId: faq.category.categoryId,
            categoryCode: faq.category.categoryCode,
            translations: mergeAllTranslations(faq.category.translations),
          }
        : null,
      creator: faq.creator,
      updater: faq.updater,
      translations: mergeAllTranslations(faq.translations),
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
   * Create new FAQ
   */
  static async createFAQ(data: any, userId: number) {
    const { categoryId, displayOrder, translations } = data;

    if (!categoryId || displayOrder === undefined) {
      throw new ValidationError('categoryId and displayOrder are required');
    }

    if (!translations || !translations.id) {
      throw new ValidationError('Indonesian translation (id) is required');
    }

    // Verify category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { categoryId },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundError('FAQ category not found');
    }

    const faq: any = await prisma.fAQ.create({
      data: {
        categoryId,
        displayOrder,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              question: translations.id.question,
              answer: translations.id.answer,
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
                    question: translations.en.question,
                    answer: translations.en.answer,
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
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
    });

    return {
      ...faq,
      category: faq.category
        ? {
            ...faq.category,
            translations: mergeAllTranslations(faq.category.translations),
          }
        : null,
      translations: mergeAllTranslations(faq.translations),
    };
  }

  /**
   * Update FAQ
   */
  static async updateFAQ(faqId: number, data: any, userId: number) {
    const { categoryId, displayOrder, isActive, translations } = data;

    const existing = await prisma.fAQ.findUnique({
      where: { faqId },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError('FAQ not found');
    }

    // Verify category if changing
    if (categoryId && categoryId !== existing.categoryId) {
      const category = await prisma.fAQCategory.findUnique({
        where: { categoryId },
      });

      if (!category || category.deletedAt) {
        throw new NotFoundError('FAQ category not found');
      }
    }

    const updateData: any = { updatedBy: userId };

    if (categoryId) updateData.categoryId = categoryId;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.fAQ.update({
      where: { faqId },
      data: updateData,
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.fAQTranslation.upsert({
            where: {
              faqId_locale: {
                faqId,
                locale,
              },
            },
            create: {
              faqId,
              locale,
              question: translations[locale].question,
              answer: translations[locale].answer,
            },
            update: {
              question: translations[locale].question,
              answer: translations[locale].answer,
            },
          });
        }
      }
    }

    const updated: any = await prisma.fAQ.findUnique({
      where: { faqId },
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
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
    });

    return {
      ...updated,
      category: updated.category
        ? {
            ...updated.category,
            translations: mergeAllTranslations(updated.category.translations),
          }
        : null,
      translations: mergeAllTranslations(updated.translations),
    };
  }

  /**
   * Soft delete FAQ
   */
  static async deleteFAQ(faqId: number, userId: number) {
    const faq = await prisma.fAQ.findUnique({
      where: { faqId },
    });

    if (!faq || faq.deletedAt) {
      throw new NotFoundError('FAQ not found');
    }

    await prisma.fAQ.update({
      where: { faqId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId,
      },
    });
  }
}
