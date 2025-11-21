"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSectionService = void 0;
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
const prisma = new client_1.PrismaClient();
class ContentSectionService {
    static async getPublicSections(locale, pageLocation) {
        const sections = await prisma.contentSection.findMany({
            where: {
                isActive: true,
                deletedAt: null,
                ...(pageLocation ? { pageLocation } : {}),
            },
            include: {
                translations: {
                    where: { locale },
                },
                media: {
                    include: {
                        mediaFile: {
                            select: {
                                fileId: true,
                                filePath: true,
                                altText: true,
                                mimeType: true,
                                fileType: true,
                            },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return sections.map((section) => {
            const translation = (0, translation_1.extractTranslation)(section, locale);
            return {
                sectionId: section.sectionId,
                sectionType: section.sectionType,
                sectionKey: section.sectionKey,
                pageLocation: section.pageLocation,
                displayOrder: section.displayOrder,
                metadata: section.metadata,
                title: translation?.title ?? '',
                subtitle: translation?.subtitle ?? null,
                description: translation?.description ?? null,
                content: translation?.content ?? null,
                additionalData: translation?.additionalData ?? null,
                media: section.media.map((m) => ({
                    contentMediaId: m.contentMediaId,
                    mediaType: m.mediaType,
                    usage: m.usage,
                    displayOrder: m.displayOrder,
                    file: m.mediaFile,
                })),
            };
        });
    }
    static async getPublicSectionByKey(sectionKey, locale) {
        const section = await prisma.contentSection.findUnique({
            where: { sectionKey },
            include: {
                translations: {
                    where: { locale },
                },
                media: {
                    include: {
                        mediaFile: {
                            select: {
                                fileId: true,
                                filePath: true,
                                altText: true,
                                mimeType: true,
                                fileType: true,
                            },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
        if (!section || !section.isActive || section.deletedAt) {
            throw new Error('Content section not found');
        }
        const translation = (0, translation_1.extractTranslation)(section, locale);
        return {
            sectionId: section.sectionId,
            sectionType: section.sectionType,
            sectionKey: section.sectionKey,
            pageLocation: section.pageLocation,
            displayOrder: section.displayOrder,
            metadata: section.metadata,
            title: translation?.title ?? '',
            subtitle: translation?.subtitle ?? null,
            description: translation?.description ?? null,
            content: translation?.content ?? null,
            additionalData: translation?.additionalData ?? null,
            media: section.media.map((m) => ({
                contentMediaId: m.contentMediaId,
                mediaType: m.mediaType,
                usage: m.usage,
                displayOrder: m.displayOrder,
                file: m.mediaFile,
            })),
        };
    }
    static async getAllSections(page = 1, limit = 10, pageLocation) {
        const skip = (page - 1) * limit;
        const [sections, total] = await Promise.all([
            prisma.contentSection.findMany({
                where: {
                    deletedAt: null,
                    ...(pageLocation ? { pageLocation } : {}),
                },
                include: {
                    translations: true,
                    media: {
                        include: {
                            mediaFile: {
                                select: {
                                    fileId: true,
                                    filePath: true,
                                    altText: true,
                                    mimeType: true,
                                    fileType: true,
                                },
                            },
                        },
                        orderBy: { displayOrder: 'asc' },
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
            prisma.contentSection.count({
                where: {
                    deletedAt: null,
                    ...(pageLocation ? { pageLocation } : {}),
                },
            }),
        ]);
        const sectionsWithMergedTranslations = sections.map((section) => ({
            sectionId: section.sectionId,
            sectionType: section.sectionType,
            sectionKey: section.sectionKey,
            pageLocation: section.pageLocation,
            displayOrder: section.displayOrder,
            isActive: section.isActive,
            metadata: section.metadata,
            translations: (0, translation_1.mergeAllTranslations)(section.translations),
            media: section.media,
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
        const section = await prisma.contentSection.create({
            data: {
                sectionType: data.sectionType,
                sectionKey: data.sectionKey,
                pageLocation: data.pageLocation,
                displayOrder: data.displayOrder,
                isActive: data.isActive ?? true,
                metadata: data.metadata,
                createdBy: data.createdBy,
                updatedBy: data.createdBy,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            title: data.translations.id.title,
                            subtitle: data.translations.id.subtitle,
                            description: data.translations.id.description,
                            content: data.translations.id.content,
                            additionalData: data.translations.id.additionalData,
                        },
                        {
                            locale: client_1.Locale.en,
                            title: data.translations.en.title,
                            subtitle: data.translations.en.subtitle,
                            description: data.translations.en.description,
                            content: data.translations.en.content,
                            additionalData: data.translations.en.additionalData,
                        },
                    ],
                },
            },
            include: {
                translations: true,
                media: {
                    include: {
                        mediaFile: true,
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
        const section = await prisma.contentSection.findUnique({
            where: { sectionId },
            include: { translations: true },
        });
        if (!section || section.deletedAt) {
            throw new Error('Content section not found');
        }
        const updateData = {
            updatedBy: data.updatedBy,
        };
        if (data.sectionType !== undefined)
            updateData.sectionType = data.sectionType;
        if (data.pageLocation !== undefined)
            updateData.pageLocation = data.pageLocation;
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.metadata !== undefined)
            updateData.metadata = data.metadata;
        await prisma.contentSection.update({
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
                    if (translationData.subtitle !== undefined)
                        updateTranslationData.subtitle = translationData.subtitle;
                    if (translationData.description !== undefined)
                        updateTranslationData.description = translationData.description;
                    if (translationData.content !== undefined)
                        updateTranslationData.content = translationData.content;
                    if (translationData.additionalData !== undefined)
                        updateTranslationData.additionalData = translationData.additionalData;
                    if (Object.keys(updateTranslationData).length > 0) {
                        if (existingTranslation) {
                            await prisma.contentTranslation.update({
                                where: { translationId: existingTranslation.translationId },
                                data: updateTranslationData,
                            });
                        }
                        else {
                            await prisma.contentTranslation.create({
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
        const finalSection = await prisma.contentSection.findUnique({
            where: { sectionId },
            include: {
                translations: true,
                media: {
                    include: {
                        mediaFile: true,
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
        const section = await prisma.contentSection.findUnique({
            where: { sectionId },
        });
        if (!section || section.deletedAt) {
            throw new Error('Content section not found');
        }
        await prisma.contentSection.update({
            where: { sectionId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Content section deleted successfully' };
    }
}
exports.ContentSectionService = ContentSectionService;
//# sourceMappingURL=content-section.service.js.map