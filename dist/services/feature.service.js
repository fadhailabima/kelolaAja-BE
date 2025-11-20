"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class FeatureService {
    static async getPublicFeatures(locale, category) {
        const where = {
            isActive: true,
            deletedAt: null,
        };
        if (category) {
            where.category = category;
        }
        const features = await prisma_1.prisma.featureMaster.findMany({
            where,
            include: {
                translations: {
                    where: { locale },
                },
            },
            orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
        });
        return features.map((feature) => {
            const translation = feature.translations[0] || {};
            return {
                featureId: feature.featureId,
                featureCode: feature.featureCode,
                category: feature.category,
                displayOrder: feature.displayOrder,
                featureName: translation.featureName || '',
                description: translation.description || '',
            };
        });
    }
    static async getPublicFeatureById(featureId, locale) {
        const feature = await prisma_1.prisma.featureMaster.findFirst({
            where: {
                featureId,
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
            },
        });
        if (!feature) {
            throw new errors_1.NotFoundError('Feature not found');
        }
        const translation = feature.translations[0] || {};
        return {
            featureId: feature.featureId,
            featureCode: feature.featureCode,
            category: feature.category,
            displayOrder: feature.displayOrder,
            featureName: translation.featureName || '',
            description: translation.description || '',
        };
    }
    static async getCategories() {
        const features = await prisma_1.prisma.featureMaster.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            select: {
                category: true,
            },
            distinct: ['category'],
            orderBy: {
                category: 'asc',
            },
        });
        return features.map((f) => f.category);
    }
    static async getAllFeatures(page, limit, search, category, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { featureCode: { contains: search, mode: 'insensitive' } },
                { translations: { some: { featureName: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const [total, features] = await Promise.all([
            prisma_1.prisma.featureMaster.count({ where }),
            prisma_1.prisma.featureMaster.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: 'asc' },
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
                orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
                skip,
                take: limit,
            }),
        ]);
        const result = features.map((feature) => ({
            featureId: feature.featureId,
            featureCode: feature.featureCode,
            category: feature.category,
            displayOrder: feature.displayOrder,
            isActive: feature.isActive,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
            creator: feature.creator,
            updater: feature.updater,
            translations: (0, translation_1.mergeAllTranslations)(feature.translations),
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
    static async createFeature(data, userId) {
        const { featureCode, category, displayOrder, translations } = data;
        if (!featureCode || !category || displayOrder === undefined) {
            throw new errors_1.ValidationError('featureCode, category, and displayOrder are required');
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError('Indonesian translation (id) is required');
        }
        const existingFeature = await prisma_1.prisma.featureMaster.findUnique({
            where: { featureCode },
        });
        if (existingFeature) {
            throw new errors_1.ValidationError('Feature code already exists');
        }
        const feature = await prisma_1.prisma.featureMaster.create({
            data: {
                featureCode,
                category,
                displayOrder,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            featureName: translations.id.featureName,
                            description: translations.id.description || null,
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    featureName: translations.en.featureName,
                                    description: translations.en.description || null,
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
            ...feature,
            translations: (0, translation_1.mergeAllTranslations)(feature.translations),
        };
    }
    static async updateFeature(featureId, data, userId) {
        const { featureCode, category, displayOrder, isActive, translations } = data;
        const existingFeature = await prisma_1.prisma.featureMaster.findUnique({
            where: { featureId },
        });
        if (!existingFeature || existingFeature.deletedAt) {
            throw new errors_1.NotFoundError('Feature not found');
        }
        if (featureCode && featureCode !== existingFeature.featureCode) {
            const duplicateFeature = await prisma_1.prisma.featureMaster.findUnique({
                where: { featureCode },
            });
            if (duplicateFeature) {
                throw new errors_1.ValidationError('Feature code already exists');
            }
        }
        const updateData = {
            updatedBy: userId,
        };
        if (featureCode)
            updateData.featureCode = featureCode;
        if (category)
            updateData.category = category;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.featureMaster.update({
            where: { featureId },
            data: updateData,
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.featureTranslation.upsert({
                        where: {
                            featureId_locale: {
                                featureId,
                                locale,
                            },
                        },
                        create: {
                            featureId,
                            locale,
                            featureName: translations[locale].featureName,
                            description: translations[locale].description || null,
                        },
                        update: {
                            featureName: translations[locale].featureName,
                            description: translations[locale].description || null,
                        },
                    });
                }
            }
        }
        const updatedFeature = await prisma_1.prisma.featureMaster.findUnique({
            where: { featureId },
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
            ...updatedFeature,
            translations: (0, translation_1.mergeAllTranslations)(updatedFeature.translations),
        };
    }
    static async deleteFeature(featureId, userId) {
        const feature = await prisma_1.prisma.featureMaster.findUnique({
            where: { featureId },
        });
        if (!feature || feature.deletedAt) {
            throw new errors_1.NotFoundError('Feature not found');
        }
        await prisma_1.prisma.featureMaster.update({
            where: { featureId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId,
            },
        });
    }
}
exports.FeatureService = FeatureService;
//# sourceMappingURL=feature.service.js.map