"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturePageService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const translation_1 = require("../utils/translation");
class FeaturePageService {
    static normalizeTranslations(translations) {
        if (!translations) {
            return [];
        }
        return translations.map(translation => ({
            ...translation,
            locale: translation.locale || client_1.Locale.id
        }));
    }
    static async ensurePage(pageId) {
        const page = await prisma_1.prisma.featurePage.findUnique({
            where: { pageId }
        });
        if (!page || page.deletedAt) {
            throw new errors_1.NotFoundError("Feature page not found");
        }
        return page;
    }
    static async ensureFeature(featureId) {
        const feature = await prisma_1.prisma.featureMaster.findUnique({
            where: { featureId }
        });
        if (!feature || feature.deletedAt) {
            throw new errors_1.ValidationError("Feature master not found");
        }
        return feature;
    }
    static async ensureMedia(fileId) {
        const file = await prisma_1.prisma.mediaFile.findUnique({
            where: { fileId }
        });
        if (!file || file.deletedAt) {
            throw new errors_1.ValidationError("Media file not found");
        }
        return file;
    }
    static formatPagePublic(page, locale) {
        const translation = (0, translation_1.extractTranslation)(this.normalizeTranslations(page.translations), locale) || {};
        return {
            pageId: page.pageId,
            pageCode: page.pageCode,
            slug: page.slug,
            featureId: page.featureId,
            heroImage: page.heroImageFile
                ? {
                    fileId: page.heroImageFile.fileId,
                    filePath: page.heroImageFile.filePath,
                    altText: page.heroImageFile.altText
                }
                : null,
            heroTitle: translation.heroTitle || "",
            heroSubtitle: translation.heroSubtitle || "",
            heroDescription: translation.heroDescription || "",
            aboutTitle: translation.aboutTitle || "",
            aboutSubtitle: translation.aboutSubtitle || "",
            aboutDescription1: translation.aboutDescription1 || "",
            aboutDescription2: translation.aboutDescription2 || "",
            ctaTitle: translation.ctaTitle || "",
            ctaDescription: translation.ctaDescription || "",
            ctaButtonText: translation.ctaButtonText || ""
        };
    }
    static formatItemPublic(item, locale) {
        const translation = (0, translation_1.extractTranslation)(this.normalizeTranslations(item.translations), locale) || {};
        return {
            itemId: item.itemId,
            itemType: item.itemType,
            displayOrder: item.displayOrder,
            title: translation.title || "",
            description: translation.description || "",
            shortDescription: translation.shortDescription || "",
            image: item.imageFile
                ? {
                    fileId: item.imageFile.fileId,
                    filePath: item.imageFile.filePath,
                    altText: item.imageFile.altText
                }
                : null
        };
    }
    static async getPublicPages(locale, featureId) {
        const pages = await prisma_1.prisma.featurePage.findMany({
            where: {
                deletedAt: null,
                isActive: true,
                ...(featureId ? { featureId } : {})
            },
            include: {
                translations: true,
                heroImageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        });
        return pages.map(page => this.formatPagePublic(page, locale));
    }
    static async getPublicPageBySlug(slug, locale) {
        const page = await prisma_1.prisma.featurePage.findFirst({
            where: {
                slug,
                deletedAt: null,
                isActive: true
            },
            include: {
                translations: true,
                heroImageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
                items: {
                    where: { isActive: true },
                    include: {
                        translations: true,
                        imageFile: {
                            select: {
                                fileId: true,
                                filePath: true,
                                altText: true
                            }
                        }
                    },
                    orderBy: { displayOrder: "asc" }
                }
            }
        });
        if (!page) {
            throw new errors_1.NotFoundError("Feature page not found");
        }
        const base = this.formatPagePublic(page, locale);
        return {
            ...base,
            items: page.items.map(item => this.formatItemPublic(item, locale))
        };
    }
    static async getPages(page, limit, search, featureId, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { pageCode: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                {
                    translations: {
                        some: {
                            OR: [
                                { heroTitle: { contains: search, mode: "insensitive" } },
                                { heroSubtitle: { contains: search, mode: "insensitive" } },
                                { aboutTitle: { contains: search, mode: "insensitive" } }
                            ]
                        }
                    }
                }
            ];
        }
        if (featureId) {
            where.featureId = featureId;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const [total, pages] = await Promise.all([
            prisma_1.prisma.featurePage.count({ where }),
            prisma_1.prisma.featurePage.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: "asc" }
                    },
                    heroImageFile: {
                        select: {
                            fileId: true,
                            filePath: true,
                            altText: true
                        }
                    },
                    featureMaster: {
                        select: {
                            featureId: true,
                            featureCode: true
                        }
                    },
                    items: {
                        select: {
                            itemId: true
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
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            })
        ]);
        const data = pages.map(pageRecord => ({
            pageId: pageRecord.pageId,
            feature: pageRecord.featureMaster,
            pageCode: pageRecord.pageCode,
            slug: pageRecord.slug,
            isActive: pageRecord.isActive,
            heroImage: pageRecord.heroImageFile,
            itemsCount: pageRecord.items.length,
            createdAt: pageRecord.createdAt,
            updatedAt: pageRecord.updatedAt,
            creator: pageRecord.creator,
            updater: pageRecord.updater,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(pageRecord.translations))
        }));
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async getPageDetail(pageId) {
        const page = await prisma_1.prisma.featurePage.findUnique({
            where: { pageId },
            include: {
                translations: {
                    orderBy: { locale: "asc" }
                },
                heroImageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
                featureMaster: {
                    select: {
                        featureId: true,
                        featureCode: true
                    }
                },
                items: {
                    include: {
                        translations: {
                            orderBy: { locale: "asc" }
                        },
                        imageFile: {
                            select: {
                                fileId: true,
                                filePath: true,
                                altText: true
                            }
                        }
                    },
                    orderBy: { displayOrder: "asc" }
                }
            }
        });
        if (!page || page.deletedAt) {
            throw new errors_1.NotFoundError("Feature page not found");
        }
        return {
            pageId: page.pageId,
            feature: page.featureMaster,
            pageCode: page.pageCode,
            slug: page.slug,
            heroImage: page.heroImageFile,
            isActive: page.isActive,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(page.translations)),
            items: page.items.map(item => ({
                itemId: item.itemId,
                itemType: item.itemType,
                displayOrder: item.displayOrder,
                isActive: item.isActive,
                image: item.imageFile,
                translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(item.translations))
            }))
        };
    }
    static async createPage(data, userId) {
        if (!data.featureId || !data.pageCode || !data.slug) {
            throw new errors_1.ValidationError("featureId, pageCode, and slug are required");
        }
        if (!data.translations || !data.translations[client_1.Locale.id]) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        await this.ensureFeature(data.featureId);
        const existing = await prisma_1.prisma.featurePage.findFirst({
            where: {
                OR: [{ pageCode: data.pageCode }, { slug: data.slug }]
            }
        });
        if (existing) {
            throw new errors_1.ValidationError("Page code or slug already exists");
        }
        if (data.heroImageFileId) {
            await this.ensureMedia(data.heroImageFileId);
        }
        const page = await prisma_1.prisma.featurePage.create({
            data: {
                featureId: data.featureId,
                pageCode: data.pageCode,
                slug: data.slug,
                heroImageFileId: data.heroImageFileId || null,
                isActive: data.isActive ?? true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: this.buildPageTranslationPayload(data.translations)
                }
            },
            include: {
                translations: true,
                heroImageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
                featureMaster: {
                    select: {
                        featureId: true,
                        featureCode: true
                    }
                }
            }
        });
        return {
            pageId: page.pageId,
            feature: page.featureMaster,
            pageCode: page.pageCode,
            slug: page.slug,
            heroImage: page.heroImageFile,
            isActive: page.isActive,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(page.translations))
        };
    }
    static buildPageTranslationPayload(translations) {
        const payload = [];
        for (const locale of Object.values(client_1.Locale)) {
            const localeData = translations?.[locale];
            if (localeData) {
                payload.push({
                    locale,
                    heroTitle: localeData.heroTitle || null,
                    heroSubtitle: localeData.heroSubtitle || null,
                    heroDescription: localeData.heroDescription || null,
                    aboutTitle: localeData.aboutTitle || null,
                    aboutSubtitle: localeData.aboutSubtitle || null,
                    aboutDescription1: localeData.aboutDescription1 || null,
                    aboutDescription2: localeData.aboutDescription2 || null,
                    ctaTitle: localeData.ctaTitle || null,
                    ctaDescription: localeData.ctaDescription || null,
                    ctaButtonText: localeData.ctaButtonText || null
                });
            }
        }
        return payload;
    }
    static async updatePage(pageId, data, userId) {
        const page = await this.ensurePage(pageId);
        const updateData = {
            updatedBy: userId
        };
        if (data.featureId && data.featureId !== page.featureId) {
            await this.ensureFeature(data.featureId);
            updateData.featureId = data.featureId;
        }
        if (data.pageCode && data.pageCode !== page.pageCode) {
            const duplicateCode = await prisma_1.prisma.featurePage.findFirst({
                where: {
                    pageCode: data.pageCode,
                    pageId: { not: pageId }
                }
            });
            if (duplicateCode) {
                throw new errors_1.ValidationError("Page code already exists");
            }
            updateData.pageCode = data.pageCode;
        }
        if (data.slug && data.slug !== page.slug) {
            const duplicateSlug = await prisma_1.prisma.featurePage.findFirst({
                where: {
                    slug: data.slug,
                    pageId: { not: pageId }
                }
            });
            if (duplicateSlug) {
                throw new errors_1.ValidationError("Slug already exists");
            }
            updateData.slug = data.slug;
        }
        if (data.heroImageFileId !== undefined) {
            if (data.heroImageFileId) {
                await this.ensureMedia(data.heroImageFileId);
                updateData.heroImageFileId = data.heroImageFileId;
            }
            else {
                updateData.heroImageFileId = null;
            }
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }
        await prisma_1.prisma.featurePage.update({
            where: { pageId },
            data: updateData
        });
        if (data.translations) {
            for (const locale of Object.values(client_1.Locale)) {
                const localeData = data.translations[locale];
                if (localeData) {
                    await prisma_1.prisma.featurePageTranslation.upsert({
                        where: {
                            pageId_locale: {
                                pageId,
                                locale
                            }
                        },
                        create: {
                            pageId,
                            locale,
                            heroTitle: localeData.heroTitle || null,
                            heroSubtitle: localeData.heroSubtitle || null,
                            heroDescription: localeData.heroDescription || null,
                            aboutTitle: localeData.aboutTitle || null,
                            aboutSubtitle: localeData.aboutSubtitle || null,
                            aboutDescription1: localeData.aboutDescription1 || null,
                            aboutDescription2: localeData.aboutDescription2 || null,
                            ctaTitle: localeData.ctaTitle || null,
                            ctaDescription: localeData.ctaDescription || null,
                            ctaButtonText: localeData.ctaButtonText || null
                        },
                        update: {
                            heroTitle: localeData.heroTitle || null,
                            heroSubtitle: localeData.heroSubtitle || null,
                            heroDescription: localeData.heroDescription || null,
                            aboutTitle: localeData.aboutTitle || null,
                            aboutSubtitle: localeData.aboutSubtitle || null,
                            aboutDescription1: localeData.aboutDescription1 || null,
                            aboutDescription2: localeData.aboutDescription2 || null,
                            ctaTitle: localeData.ctaTitle || null,
                            ctaDescription: localeData.ctaDescription || null,
                            ctaButtonText: localeData.ctaButtonText || null
                        }
                    });
                }
            }
        }
        return this.getPageDetail(pageId);
    }
    static async deletePage(pageId, userId) {
        await this.ensurePage(pageId);
        await prisma_1.prisma.featurePage.update({
            where: { pageId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
    static async listItems(pageId) {
        await this.ensurePage(pageId);
        const items = await prisma_1.prisma.featurePageItem.findMany({
            where: { pageId },
            include: {
                translations: {
                    orderBy: { locale: "asc" }
                },
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            },
            orderBy: { displayOrder: "asc" }
        });
        return items.map(item => ({
            itemId: item.itemId,
            itemType: item.itemType,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
            image: item.imageFile,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(item.translations))
        }));
    }
    static async createItem(pageId, data) {
        await this.ensurePage(pageId);
        if (data.displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!data.translations || !data.translations[client_1.Locale.id]) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        if (data.imageFileId) {
            await this.ensureMedia(data.imageFileId);
        }
        const item = await prisma_1.prisma.featurePageItem.create({
            data: {
                pageId,
                itemType: data.itemType || null,
                imageFileId: data.imageFileId || null,
                displayOrder: data.displayOrder,
                isActive: data.isActive ?? true,
                translations: {
                    create: this.buildItemTranslationPayload(data.translations)
                }
            },
            include: {
                translations: true,
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            }
        });
        return {
            itemId: item.itemId,
            itemType: item.itemType,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
            image: item.imageFile,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(item.translations))
        };
    }
    static buildItemTranslationPayload(translations) {
        const payload = [];
        for (const locale of Object.values(client_1.Locale)) {
            const localeData = translations?.[locale];
            if (localeData) {
                payload.push({
                    locale,
                    title: localeData.title || null,
                    description: localeData.description || null,
                    shortDescription: localeData.shortDescription || null
                });
            }
        }
        return payload;
    }
    static async updateItem(itemId, data) {
        const item = await prisma_1.prisma.featurePageItem.findUnique({
            where: { itemId },
            include: {
                translations: true
            }
        });
        if (!item) {
            throw new errors_1.NotFoundError("Feature page item not found");
        }
        const updateData = {};
        if (data.itemType !== undefined)
            updateData.itemType = data.itemType;
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.imageFileId !== undefined) {
            if (data.imageFileId) {
                await this.ensureMedia(data.imageFileId);
                updateData.imageFileId = data.imageFileId;
            }
            else {
                updateData.imageFileId = null;
            }
        }
        if (Object.keys(updateData).length > 0) {
            await prisma_1.prisma.featurePageItem.update({
                where: { itemId },
                data: updateData
            });
        }
        if (data.translations) {
            for (const locale of Object.values(client_1.Locale)) {
                const localeData = data.translations[locale];
                if (localeData) {
                    await prisma_1.prisma.featurePageItemTranslation.upsert({
                        where: {
                            itemId_locale: {
                                itemId,
                                locale
                            }
                        },
                        create: {
                            itemId,
                            locale,
                            title: localeData.title || null,
                            description: localeData.description || null,
                            shortDescription: localeData.shortDescription || null
                        },
                        update: {
                            title: localeData.title || null,
                            description: localeData.description || null,
                            shortDescription: localeData.shortDescription || null
                        }
                    });
                }
            }
        }
        const updated = await prisma_1.prisma.featurePageItem.findUnique({
            where: { itemId },
            include: {
                translations: {
                    orderBy: { locale: "asc" }
                },
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            }
        });
        return {
            itemId: updated.itemId,
            itemType: updated.itemType,
            displayOrder: updated.displayOrder,
            isActive: updated.isActive,
            image: updated.imageFile,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(updated.translations))
        };
    }
    static async deleteItem(itemId) {
        const item = await prisma_1.prisma.featurePageItem.findUnique({
            where: { itemId }
        });
        if (!item) {
            throw new errors_1.NotFoundError("Feature page item not found");
        }
        await prisma_1.prisma.featurePageItemTranslation.deleteMany({
            where: { itemId }
        });
        await prisma_1.prisma.featurePageItem.delete({
            where: { itemId }
        });
    }
}
exports.FeaturePageService = FeaturePageService;
//# sourceMappingURL=feature-page.service.js.map