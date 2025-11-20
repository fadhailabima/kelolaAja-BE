"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class PricingService {
    static async getPublicPlans(locale) {
        const plans = await prisma_1.prisma.pricingPlan.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
                planFeatures: {
                    where: {
                        isIncluded: true,
                    },
                    include: {
                        feature: {
                            include: {
                                translations: {
                                    where: { locale },
                                },
                            },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return plans.map((plan) => {
            const translation = plan.translations[0] || {};
            const features = plan.planFeatures.map((pf) => ({
                featureCode: pf.feature.featureCode,
                featureName: pf.feature.translations[0]?.featureName || '',
                description: pf.feature.translations[0]?.description || '',
                category: pf.feature.category,
                displayOrder: pf.displayOrder,
            }));
            return {
                planId: plan.planId,
                planCode: plan.planCode,
                pricePerUserMonth: plan.pricePerUserMonth,
                minUsers: plan.minUsers,
                maxUsers: plan.maxUsers,
                displayOrder: plan.displayOrder,
                badgeColor: plan.badgeColor,
                planName: translation.planName || '',
                pricePeriod: translation.pricePeriod || '',
                userRange: translation.userRange || '',
                description: translation.description || '',
                features,
            };
        });
    }
    static async getPublicPlanById(planId, locale) {
        const plan = await prisma_1.prisma.pricingPlan.findFirst({
            where: {
                planId,
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
                planFeatures: {
                    where: {
                        isIncluded: true,
                    },
                    include: {
                        feature: {
                            include: {
                                translations: {
                                    where: { locale },
                                },
                            },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
        if (!plan) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        const translation = plan.translations[0] || {};
        const features = plan.planFeatures.map((pf) => ({
            featureCode: pf.feature.featureCode,
            featureName: pf.feature.translations[0]?.featureName || '',
            description: pf.feature.translations[0]?.description || '',
            category: pf.feature.category,
            displayOrder: pf.displayOrder,
        }));
        return {
            planId: plan.planId,
            planCode: plan.planCode,
            pricePerUserMonth: plan.pricePerUserMonth,
            minUsers: plan.minUsers,
            maxUsers: plan.maxUsers,
            displayOrder: plan.displayOrder,
            badgeColor: plan.badgeColor,
            planName: translation.planName || '',
            pricePeriod: translation.pricePeriod || '',
            userRange: translation.userRange || '',
            description: translation.description || '',
            features,
        };
    }
    static async getAllPlans(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { planCode: { contains: search, mode: 'insensitive' } },
                { translations: { some: { planName: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const [total, plans] = await Promise.all([
            prisma_1.prisma.pricingPlan.count({ where }),
            prisma_1.prisma.pricingPlan.findMany({
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
                orderBy: { displayOrder: 'asc' },
                skip,
                take: limit,
            }),
        ]);
        const result = plans.map((plan) => ({
            planId: plan.planId,
            planCode: plan.planCode,
            pricePerUserMonth: plan.pricePerUserMonth,
            minUsers: plan.minUsers,
            maxUsers: plan.maxUsers,
            displayOrder: plan.displayOrder,
            badgeColor: plan.badgeColor,
            isActive: plan.isActive,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
            creator: plan.creator,
            updater: plan.updater,
            translations: (0, translation_1.mergeAllTranslations)(plan.translations),
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
    static async createPlan(data, userId) {
        const { planCode, pricePerUserMonth, minUsers, maxUsers, displayOrder, badgeColor, translations, } = data;
        if (!planCode || !pricePerUserMonth || !minUsers || displayOrder === undefined) {
            throw new errors_1.ValidationError('planCode, pricePerUserMonth, minUsers, and displayOrder are required');
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError('Indonesian translation (id) is required');
        }
        const existingPlan = await prisma_1.prisma.pricingPlan.findUnique({
            where: { planCode },
        });
        if (existingPlan) {
            throw new errors_1.ValidationError('Plan code already exists');
        }
        const plan = await prisma_1.prisma.pricingPlan.create({
            data: {
                planCode,
                pricePerUserMonth,
                minUsers,
                maxUsers: maxUsers || null,
                displayOrder,
                badgeColor: badgeColor || null,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            planName: translations.id.planName,
                            pricePeriod: translations.id.pricePeriod || null,
                            userRange: translations.id.userRange || null,
                            description: translations.id.description || null,
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    planName: translations.en.planName,
                                    pricePeriod: translations.en.pricePeriod || null,
                                    userRange: translations.en.userRange || null,
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
            ...plan,
            translations: (0, translation_1.mergeAllTranslations)(plan.translations),
        };
    }
    static async updatePlan(planId, data, userId) {
        const { planCode, pricePerUserMonth, minUsers, maxUsers, displayOrder, badgeColor, isActive, translations, } = data;
        const existingPlan = await prisma_1.prisma.pricingPlan.findUnique({
            where: { planId },
        });
        if (!existingPlan || existingPlan.deletedAt) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        if (planCode && planCode !== existingPlan.planCode) {
            const duplicatePlan = await prisma_1.prisma.pricingPlan.findUnique({
                where: { planCode },
            });
            if (duplicatePlan) {
                throw new errors_1.ValidationError('Plan code already exists');
            }
        }
        const updateData = {
            updatedBy: userId,
        };
        if (planCode)
            updateData.planCode = planCode;
        if (pricePerUserMonth !== undefined)
            updateData.pricePerUserMonth = pricePerUserMonth;
        if (minUsers !== undefined)
            updateData.minUsers = minUsers;
        if (maxUsers !== undefined)
            updateData.maxUsers = maxUsers;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (badgeColor !== undefined)
            updateData.badgeColor = badgeColor;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.pricingPlan.update({
            where: { planId },
            data: updateData,
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.pricingTranslation.upsert({
                        where: {
                            planId_locale: {
                                planId,
                                locale,
                            },
                        },
                        create: {
                            planId,
                            locale,
                            planName: translations[locale].planName,
                            pricePeriod: translations[locale].pricePeriod || null,
                            userRange: translations[locale].userRange || null,
                            description: translations[locale].description || null,
                        },
                        update: {
                            planName: translations[locale].planName,
                            pricePeriod: translations[locale].pricePeriod || null,
                            userRange: translations[locale].userRange || null,
                            description: translations[locale].description || null,
                        },
                    });
                }
            }
        }
        const updatedPlan = await prisma_1.prisma.pricingPlan.findUnique({
            where: { planId },
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
            ...updatedPlan,
            translations: (0, translation_1.mergeAllTranslations)(updatedPlan.translations),
        };
    }
    static async deletePlan(planId, userId) {
        const plan = await prisma_1.prisma.pricingPlan.findUnique({
            where: { planId },
        });
        if (!plan || plan.deletedAt) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        await prisma_1.prisma.pricingPlan.update({
            where: { planId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId,
            },
        });
    }
}
exports.PricingService = PricingService;
//# sourceMappingURL=pricing.service.js.map