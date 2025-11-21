"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KelolaAjaFeatureService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class KelolaAjaFeatureService {
    static async getPublicFeatures(locale) {
        const features = await prisma_1.prisma.kelolaAjaFeature.findMany({
            where: {
                isActive: true,
                deletedAt: null
            },
            include: {
                translations: {
                    where: { locale }
                }
            },
            orderBy: { displayOrder: "asc" }
        });
        return features.map((feature) => {
            const translation = feature.translations[0] || {};
            return {
                featureId: feature.featureId,
                displayOrder: feature.displayOrder,
                iconName: feature.iconName,
                title: translation.title || "",
                description: translation.description || ""
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
            prisma_1.prisma.kelolaAjaFeature.count({ where }),
            prisma_1.prisma.kelolaAjaFeature.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: "asc" }
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
            iconName: feature.iconName,
            isActive: feature.isActive,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
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
        const { displayOrder, iconName, translations } = data;
        if (displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const featureCode = `KELOLA_FEATURE_${Date.now()}`;
        const feature = await prisma_1.prisma.kelolaAjaFeature.create({
            data: {
                featureCode,
                displayOrder,
                iconName: iconName || null,
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
        const { displayOrder, iconName, isActive, translations } = data;
        const existing = await prisma_1.prisma.kelolaAjaFeature.findUnique({
            where: { featureId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("KelolaAja feature not found");
        }
        const updateData = { updatedBy: userId };
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (iconName !== undefined)
            updateData.iconName = iconName;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.kelolaAjaFeature.update({
            where: { featureId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.kelolaAjaFeatureTranslation.upsert({
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
        const updated = await prisma_1.prisma.kelolaAjaFeature.findUnique({
            where: { featureId },
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
    static async deleteFeature(featureId, userId) {
        const feature = await prisma_1.prisma.kelolaAjaFeature.findUnique({
            where: { featureId }
        });
        if (!feature || feature.deletedAt) {
            throw new errors_1.NotFoundError("KelolaAja feature not found");
        }
        await prisma_1.prisma.kelolaAjaFeature.update({
            where: { featureId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.KelolaAjaFeatureService = KelolaAjaFeatureService;
//# sourceMappingURL=kelolaaja-feature.service.js.map