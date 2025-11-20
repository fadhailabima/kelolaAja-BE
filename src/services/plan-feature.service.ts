import { prisma } from '../utils/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import { Locale } from '@prisma/client';

export class PlanFeatureService {
  /**
   * Get features for a specific plan (Public)
   */
  static async getPlanFeatures(planId: number, locale: Locale) {
    const plan = await prisma.pricingPlan.findUnique({
      where: { planId },
    });

    if (!plan || plan.deletedAt || !plan.isActive) {
      throw new NotFoundError('Pricing plan not found');
    }

    const planFeatures: any = await prisma.planFeatureList.findMany({
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

    return planFeatures.map((pf: any) => {
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

  /**
   * Add feature to plan (Admin)
   */
  static async addFeatureToPlan(data: any) {
    const { planId, featureId, isIncluded = true, displayOrder } = data;

    if (!planId || !featureId || displayOrder === undefined) {
      throw new ValidationError('planId, featureId, and displayOrder are required');
    }

    // Verify plan exists
    const plan = await prisma.pricingPlan.findUnique({ where: { planId } });
    if (!plan || plan.deletedAt) {
      throw new NotFoundError('Pricing plan not found');
    }

    // Verify feature exists
    const feature = await prisma.featureMaster.findUnique({ where: { featureId } });
    if (!feature || feature.deletedAt) {
      throw new NotFoundError('Feature not found');
    }

    // Check if already exists
    const existing = await prisma.planFeatureList.findUnique({
      where: {
        planId_featureId: {
          planId,
          featureId,
        },
      },
    });

    if (existing) {
      throw new ValidationError('Feature already assigned to this plan');
    }

    // Create plan feature
    const planFeature = await prisma.planFeatureList.create({
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

  /**
   * Update plan feature (Admin)
   */
  static async updatePlanFeature(listId: number, data: any) {
    const { isIncluded, displayOrder } = data;

    const existing = await prisma.planFeatureList.findUnique({
      where: { listId },
    });

    if (!existing) {
      throw new NotFoundError('Plan feature not found');
    }

    const updateData: any = {};

    if (isIncluded !== undefined) updateData.isIncluded = isIncluded;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updated = await prisma.planFeatureList.update({
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

  /**
   * Remove feature from plan (Admin)
   */
  static async removeFeatureFromPlan(listId: number) {
    const existing = await prisma.planFeatureList.findUnique({
      where: { listId },
    });

    if (!existing) {
      throw new NotFoundError('Plan feature not found');
    }

    await prisma.planFeatureList.delete({
      where: { listId },
    });
  }

  /**
   * Bulk add features to plan (Admin)
   */
  static async bulkAddFeatures(planId: number, features: any[]) {
    // Verify plan exists
    const plan = await prisma.pricingPlan.findUnique({ where: { planId } });
    if (!plan || plan.deletedAt) {
      throw new NotFoundError('Pricing plan not found');
    }

    // Verify all features exist
    const featureIds = features.map((f) => f.featureId);
    const existingFeatures = await prisma.featureMaster.findMany({
      where: {
        featureId: { in: featureIds },
        deletedAt: null,
      },
    });

    if (existingFeatures.length !== featureIds.length) {
      throw new ValidationError('One or more features not found');
    }

    // Create all plan features
    const planFeatures = await prisma.planFeatureList.createMany({
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
