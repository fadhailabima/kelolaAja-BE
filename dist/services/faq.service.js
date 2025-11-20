"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class FAQService {
    static async getPublicFAQs(locale, categoryId) {
        const where = {
            isActive: true,
            deletedAt: null,
        };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const faqs = await prisma_1.prisma.fAQ.findMany({
            where,
            include: {
                translations: {
                    where: { locale },
                },
                category: {
                    include: {
                        translations: {
                            where: { locale },
                        },
                    },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return faqs.map((faq) => {
            const translation = faq.translations[0] || {};
            const categoryTranslation = faq.category?.translations[0] || {};
            return {
                faqId: faq.faqId,
                displayOrder: faq.displayOrder,
                question: translation.question || '',
                answer: translation.answer || '',
                category: faq.category
                    ? {
                        categoryId: faq.category.categoryId,
                        categoryCode: faq.category.categoryCode,
                        categoryName: categoryTranslation.categoryName || '',
                    }
                    : null,
            };
        });
    }
    static async getPublicFAQsByCategory(locale) {
        const categories = await prisma_1.prisma.fAQCategory.findMany({
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
                    include: {
                        translations: {
                            where: { locale },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return categories.map((category) => {
            const categoryTranslation = category.translations[0] || {};
            return {
                categoryId: category.categoryId,
                categoryCode: category.categoryCode,
                categoryName: categoryTranslation.categoryName || '',
                displayOrder: category.displayOrder,
                faqs: category.faqs.map((faq) => {
                    const translation = faq.translations[0] || {};
                    return {
                        faqId: faq.faqId,
                        displayOrder: faq.displayOrder,
                        question: translation.question || '',
                        answer: translation.answer || '',
                    };
                }),
            };
        });
    }
    static async getPublicFAQById(faqId, locale) {
        const faq = await prisma_1.prisma.fAQ.findFirst({
            where: {
                faqId,
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
                category: {
                    include: {
                        translations: {
                            where: { locale },
                        },
                    },
                },
            },
        });
        if (!faq) {
            throw new errors_1.NotFoundError('FAQ not found');
        }
        const translation = faq.translations[0] || {};
        const categoryTranslation = faq.category?.translations[0] || {};
        return {
            faqId: faq.faqId,
            displayOrder: faq.displayOrder,
            question: translation.question || '',
            answer: translation.answer || '',
            category: faq.category
                ? {
                    categoryId: faq.category.categoryId,
                    categoryCode: faq.category.categoryCode,
                    categoryName: categoryTranslation.categoryName || '',
                }
                : null,
        };
    }
    static async getAllFAQs(page, limit, search, categoryId, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
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
        const [total, faqs] = await Promise.all([
            prisma_1.prisma.fAQ.count({ where }),
            prisma_1.prisma.fAQ.findMany({
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
        const result = faqs.map((faq) => ({
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
                    translations: (0, translation_1.mergeAllTranslations)(faq.category.translations),
                }
                : null,
            creator: faq.creator,
            updater: faq.updater,
            translations: (0, translation_1.mergeAllTranslations)(faq.translations),
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
    static async createFAQ(data, userId) {
        const { categoryId, displayOrder, translations } = data;
        if (!categoryId || displayOrder === undefined) {
            throw new errors_1.ValidationError('categoryId and displayOrder are required');
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError('Indonesian translation (id) is required');
        }
        const category = await prisma_1.prisma.fAQCategory.findUnique({
            where: { categoryId },
        });
        if (!category || category.deletedAt) {
            throw new errors_1.NotFoundError('FAQ category not found');
        }
        const faq = await prisma_1.prisma.fAQ.create({
            data: {
                categoryId,
                displayOrder,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            question: translations.id.question,
                            answer: translations.id.answer,
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
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
                    translations: (0, translation_1.mergeAllTranslations)(faq.category.translations),
                }
                : null,
            translations: (0, translation_1.mergeAllTranslations)(faq.translations),
        };
    }
    static async updateFAQ(faqId, data, userId) {
        const { categoryId, displayOrder, isActive, translations } = data;
        const existing = await prisma_1.prisma.fAQ.findUnique({
            where: { faqId },
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError('FAQ not found');
        }
        if (categoryId && categoryId !== existing.categoryId) {
            const category = await prisma_1.prisma.fAQCategory.findUnique({
                where: { categoryId },
            });
            if (!category || category.deletedAt) {
                throw new errors_1.NotFoundError('FAQ category not found');
            }
        }
        const updateData = { updatedBy: userId };
        if (categoryId)
            updateData.categoryId = categoryId;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.fAQ.update({
            where: { faqId },
            data: updateData,
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.fAQTranslation.upsert({
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
        const updated = await prisma_1.prisma.fAQ.findUnique({
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
                    translations: (0, translation_1.mergeAllTranslations)(updated.category.translations),
                }
                : null,
            translations: (0, translation_1.mergeAllTranslations)(updated.translations),
        };
    }
    static async deleteFAQ(faqId, userId) {
        const faq = await prisma_1.prisma.fAQ.findUnique({
            where: { faqId },
        });
        if (!faq || faq.deletedAt) {
            throw new errors_1.NotFoundError('FAQ not found');
        }
        await prisma_1.prisma.fAQ.update({
            where: { faqId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId,
            },
        });
    }
}
exports.FAQService = FAQService;
//# sourceMappingURL=faq.service.js.map