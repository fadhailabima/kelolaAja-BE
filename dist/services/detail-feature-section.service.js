"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailFeatureSectionService = void 0;
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
const prisma = new client_1.PrismaClient();
class DetailFeatureSectionService {
    static async getPublicSections(locale, category) {
        const sections = await prisma.detailFeatureSection.findMany({
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
        return sections.map((section) => {
            const translation = (0, translation_1.extractTranslation)(section, locale);
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
    static async getAllSections(page = 1, limit = 10, category) {
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
        const sectionsWithMergedTranslations = sections.map((section) => ({
            sectionId: section.sectionId,
            sectionCode: section.sectionCode,
            category: section.category,
            displayOrder: section.displayOrder,
            iconFileId: section.iconFileId,
            isActive: section.isActive,
            icon: section.iconFile,
            translations: (0, translation_1.mergeAllTranslations)(section.translations),
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
    static async createSection(data) {
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
                            locale: client_1.Locale.id,
                            title: data.translations.id.title,
                            description: data.translations.id.description,
                        },
                        {
                            locale: client_1.Locale.en,
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
            translations: (0, translation_1.mergeAllTranslations)(section.translations),
        };
    }
    static async updateSection(sectionId, data) {
        const section = await prisma.detailFeatureSection.findUnique({
            where: { sectionId },
            include: { translations: true },
        });
        if (!section || section.deletedAt) {
            throw new Error('Detail feature section not found');
        }
        const updateData = {
            updatedBy: data.updatedBy,
        };
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.iconFileId !== undefined)
            updateData.iconFileId = data.iconFileId;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        await prisma.detailFeatureSection.update({
            where: { sectionId },
            data: updateData,
        });
        if (data.translations) {
            for (const locale of [client_1.Locale.id, client_1.Locale.en]) {
                const translationData = data.translations[locale];
                if (translationData) {
                    const existingTranslation = section.translations.find((t) => t.locale === locale);
                    const updateTranslationData = {};
                    if (translationData.title !== undefined)
                        updateTranslationData.title = translationData.title;
                    if (translationData.description !== undefined)
                        updateTranslationData.description = translationData.description;
                    if (Object.keys(updateTranslationData).length > 0) {
                        if (existingTranslation) {
                            await prisma.detailFeatureTranslation.update({
                                where: { translationId: existingTranslation.translationId },
                                data: updateTranslationData,
                            });
                        }
                        else {
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
            translations: (0, translation_1.mergeAllTranslations)(finalSection.translations),
        };
    }
    static async deleteSection(sectionId) {
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
exports.DetailFeatureSectionService = DetailFeatureSectionService;
//# sourceMappingURL=detail-feature-section.service.js.map