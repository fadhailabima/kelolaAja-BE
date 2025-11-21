"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQCategoryService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class FAQCategoryService {
    static async getPublicCategories(locale) {
        const categories = await prisma_1.prisma.fAQCategory.findMany({
            where: {
                isActive: true,
                deletedAt: null
            },
            include: {
                translations: {
                    where: { locale }
                },
                faqs: {
                    where: {
                        isActive: true,
                        deletedAt: null
                    },
                    select: {
                        faqId: true
                    }
                }
            },
            orderBy: { displayOrder: "asc" }
        });
        return categories.map((category) => {
            const translation = category.translations[0] || {};
            return {
                categoryId: category.categoryId,
                categoryCode: category.categoryCode,
                displayOrder: category.displayOrder,
                categoryName: translation.categoryName || "",
                faqCount: category.faqs.length
            };
        });
    }
    static async getAllCategories(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { categoryCode: { contains: search, mode: "insensitive" } },
                { translations: { some: { categoryName: { contains: search, mode: "insensitive" } } } }
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const [total, categories] = await Promise.all([
            prisma_1.prisma.fAQCategory.count({ where }),
            prisma_1.prisma.fAQCategory.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: "asc" }
                    },
                    faqs: {
                        select: {
                            faqId: true
                        }
                    },
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true
                        }
                    },
                    updater: {
                        select: {
                            userId: true,
                            username: true,
                            email: true
                        }
                    }
                },
                orderBy: { displayOrder: "asc" },
                skip,
                take: limit
            })
        ]);
        const result = categories.map((category) => ({
            categoryId: category.categoryId,
            categoryCode: category.categoryCode,
            displayOrder: category.displayOrder,
            isActive: category.isActive,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            creator: category.creator,
            updater: category.updater,
            faqCount: category.faqs.length,
            translations: (0, translation_1.mergeAllTranslations)(category.translations)
        }));
        return {
            data: result,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async createCategory(data, userId) {
        const { categoryCode, displayOrder, translations } = data;
        if (!categoryCode || displayOrder === undefined) {
            throw new errors_1.ValidationError("categoryCode and displayOrder are required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const existing = await prisma_1.prisma.fAQCategory.findUnique({
            where: { categoryCode }
        });
        if (existing) {
            throw new errors_1.ValidationError("Category code already exists");
        }
        const category = await prisma_1.prisma.fAQCategory.create({
            data: {
                categoryCode,
                displayOrder,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            categoryName: translations.id.categoryName
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    categoryName: translations.en.categoryName
                                }
                            ]
                            : [])
                    ]
                }
            },
            include: {
                translations: true,
                creator: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return {
            ...category,
            translations: (0, translation_1.mergeAllTranslations)(category.translations)
        };
    }
    static async updateCategory(categoryId, data, userId) {
        const { categoryCode, displayOrder, isActive, translations } = data;
        const existing = await prisma_1.prisma.fAQCategory.findUnique({
            where: { categoryId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("FAQ category not found");
        }
        if (categoryCode && categoryCode !== existing.categoryCode) {
            const duplicate = await prisma_1.prisma.fAQCategory.findUnique({
                where: { categoryCode }
            });
            if (duplicate) {
                throw new errors_1.ValidationError("Category code already exists");
            }
        }
        const updateData = { updatedBy: userId };
        if (categoryCode)
            updateData.categoryCode = categoryCode;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.fAQCategory.update({
            where: { categoryId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.fAQCategoryTranslation.upsert({
                        where: {
                            categoryId_locale: {
                                categoryId,
                                locale
                            }
                        },
                        create: {
                            categoryId,
                            locale,
                            categoryName: translations[locale].categoryName
                        },
                        update: {
                            categoryName: translations[locale].categoryName
                        }
                    });
                }
            }
        }
        const updated = await prisma_1.prisma.fAQCategory.findUnique({
            where: { categoryId },
            include: {
                translations: true,
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return {
            ...updated,
            translations: (0, translation_1.mergeAllTranslations)(updated.translations)
        };
    }
    static async deleteCategory(categoryId, userId) {
        const category = await prisma_1.prisma.fAQCategory.findUnique({
            where: { categoryId },
            include: {
                faqs: {
                    where: { deletedAt: null }
                }
            }
        });
        if (!category || category.deletedAt) {
            throw new errors_1.NotFoundError("FAQ category not found");
        }
        if (category.faqs.length > 0) {
            throw new errors_1.ValidationError("Cannot delete category with existing FAQs. Please delete or move FAQs first.");
        }
        await prisma_1.prisma.fAQCategory.update({
            where: { categoryId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.FAQCategoryService = FAQCategoryService;
//# sourceMappingURL=faq-category.service.js.map