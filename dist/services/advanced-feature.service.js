"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedFeatureService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class AdvancedFeatureService {
    static async getPublicFeatures(locale) {
        const features = await prisma_1.prisma.advancedFeature.findMany({
            where: {
                isActive: true,
                deletedAt: null
            },
            include: {
                translations: {
                    where: { locale }
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
        return features.map((feature) => {
            const translation = feature.translations[0] || {};
            return {
                featureId: feature.featureId,
                displayOrder: feature.displayOrder,
                linkUrl: feature.linkUrl,
                title: translation.title || "",
                description: translation.description || "",
                image: feature.imageFile
                    ? {
                        fileId: feature.imageFile.fileId,
                        filePath: feature.imageFile.filePath,
                        altText: feature.imageFile.altText
                    }
                    : null
            };
        });
    }
    static async getAllFeatures(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.translations = {
                some: {
                    OR: [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }]
                }
            };
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const [total, features] = await Promise.all([
            prisma_1.prisma.advancedFeature.count({ where }),
            prisma_1.prisma.advancedFeature.findMany({
                where,
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
        const result = features.map((feature) => ({
            featureId: feature.featureId,
            displayOrder: feature.displayOrder,
            linkUrl: feature.linkUrl,
            imageFileId: feature.imageFileId,
            isActive: feature.isActive,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
            image: feature.imageFile,
            creator: feature.creator,
            updater: feature.updater,
            translations: (0, translation_1.mergeAllTranslations)(feature.translations)
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
    static async createFeature(data, userId) {
        const { displayOrder, linkUrl, imageFileId, translations } = data;
        if (displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId }
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError("Image file not found");
            }
        }
        const featureCode = `ADV_FEATURE_${Date.now()}`;
        const feature = await prisma_1.prisma.advancedFeature.create({
            data: {
                featureCode,
                displayOrder,
                linkUrl: linkUrl || null,
                imageFileId: imageFileId || null,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            title: translations.id.title,
                            description: translations.id.description || null
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    title: translations.en.title,
                                    description: translations.en.description || null
                                }
                            ]
                            : [])
                    ]
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
                },
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
            ...feature,
            translations: (0, translation_1.mergeAllTranslations)(feature.translations)
        };
    }
    static async updateFeature(featureId, data, userId) {
        const { displayOrder, linkUrl, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.advancedFeature.findUnique({
            where: { featureId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("Advanced feature not found");
        }
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId }
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError("Image file not found");
            }
        }
        const updateData = { updatedBy: userId };
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (linkUrl !== undefined)
            updateData.linkUrl = linkUrl;
        if (imageFileId !== undefined)
            updateData.imageFileId = imageFileId;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.advancedFeature.update({
            where: { featureId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.advancedFeatureTranslation.upsert({
                        where: {
                            featureId_locale: {
                                featureId,
                                locale
                            }
                        },
                        create: {
                            featureId,
                            locale,
                            title: translations[locale].title,
                            description: translations[locale].description || null
                        },
                        update: {
                            title: translations[locale].title,
                            description: translations[locale].description || null
                        }
                    });
                }
            }
        }
        const updated = await prisma_1.prisma.advancedFeature.findUnique({
            where: { featureId },
            include: {
                translations: true,
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
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
    static async deleteFeature(featureId, userId) {
        const feature = await prisma_1.prisma.advancedFeature.findUnique({
            where: { featureId }
        });
        if (!feature || feature.deletedAt) {
            throw new errors_1.NotFoundError("Advanced feature not found");
        }
        await prisma_1.prisma.advancedFeature.update({
            where: { featureId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.AdvancedFeatureService = AdvancedFeatureService;
//# sourceMappingURL=advanced-feature.service.js.map