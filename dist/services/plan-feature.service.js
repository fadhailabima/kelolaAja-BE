"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanFeatureService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
class PlanFeatureService {
    static async getPlanFeatures(planId, locale) {
        const plan = await prisma_1.prisma.pricingPlan.findUnique({
            where: { planId },
        });
        if (!plan || plan.deletedAt || !plan.isActive) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        const planFeatures = await prisma_1.prisma.planFeatureList.findMany({
            where: {
                planId,
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
        });
        return planFeatures.map((pf) => {
            const translation = pf.feature.translations[0] || {};
            return {
                listId: pf.listId,
                featureCode: pf.feature.featureCode,
                featureName: translation.featureName || '',
                description: translation.description || '',
                category: pf.feature.category,
                isIncluded: pf.isIncluded,
                displayOrder: pf.displayOrder,
            };
        });
    }
    static async addFeatureToPlan(data) {
        const { planId, featureId, isIncluded = true, displayOrder } = data;
        if (!planId || !featureId || displayOrder === undefined) {
            throw new errors_1.ValidationError('planId, featureId, and displayOrder are required');
        }
        const plan = await prisma_1.prisma.pricingPlan.findUnique({ where: { planId } });
        if (!plan || plan.deletedAt) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        const feature = await prisma_1.prisma.featureMaster.findUnique({ where: { featureId } });
        if (!feature || feature.deletedAt) {
            throw new errors_1.NotFoundError('Feature not found');
        }
        const existing = await prisma_1.prisma.planFeatureList.findUnique({
            where: {
                planId_featureId: {
                    planId,
                    featureId,
                },
            },
        });
        if (existing) {
            throw new errors_1.ValidationError('Feature already assigned to this plan');
        }
        const planFeature = await prisma_1.prisma.planFeatureList.create({
            data: {
                planId,
                featureId,
                isIncluded,
                displayOrder,
            },
            include: {
                feature: {
                    include: {
                        translations: true,
                    },
                },
            },
        });
        return planFeature;
    }
    static async updatePlanFeature(listId, data) {
        const { isIncluded, displayOrder } = data;
        const existing = await prisma_1.prisma.planFeatureList.findUnique({
            where: { listId },
        });
        if (!existing) {
            throw new errors_1.NotFoundError('Plan feature not found');
        }
        const updateData = {};
        if (isIncluded !== undefined)
            updateData.isIncluded = isIncluded;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        const updated = await prisma_1.prisma.planFeatureList.update({
            where: { listId },
            data: updateData,
            include: {
                feature: {
                    include: {
                        translations: true,
                    },
                },
            },
        });
        return updated;
    }
    static async removeFeatureFromPlan(listId) {
        const existing = await prisma_1.prisma.planFeatureList.findUnique({
            where: { listId },
        });
        if (!existing) {
            throw new errors_1.NotFoundError('Plan feature not found');
        }
        await prisma_1.prisma.planFeatureList.delete({
            where: { listId },
        });
    }
    static async bulkAddFeatures(planId, features) {
        const plan = await prisma_1.prisma.pricingPlan.findUnique({ where: { planId } });
        if (!plan || plan.deletedAt) {
            throw new errors_1.NotFoundError('Pricing plan not found');
        }
        const featureIds = features.map((f) => f.featureId);
        const existingFeatures = await prisma_1.prisma.featureMaster.findMany({
            where: {
                featureId: { in: featureIds },
                deletedAt: null,
            },
        });
        if (existingFeatures.length !== featureIds.length) {
            throw new errors_1.ValidationError('One or more features not found');
        }
        const planFeatures = await prisma_1.prisma.planFeatureList.createMany({
            data: features.map((f) => ({
                planId,
                featureId: f.featureId,
                isIncluded: f.isIncluded ?? true,
                displayOrder: f.displayOrder,
            })),
            skipDuplicates: true,
        });
        return {
            count: planFeatures.count,
            message: `${planFeatures.count} features added to plan`,
        };
    }
}
exports.PlanFeatureService = PlanFeatureService;
//# sourceMappingURL=plan-feature.service.js.map