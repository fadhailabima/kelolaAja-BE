import { prisma } from '../utils/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import { Locale } from '@prisma/client';
import { mergeAllTranslations } from '../utils/translation';

export class PricingService {
  /**
   * Get all active pricing plans for public (locale-aware)
   */
  static async getPublicPlans(_locale: Locale) {
    const plans: any = await prisma.pricingPlan.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        planFeatures: {
          where: {
            isIncluded: true,
          },
          include: {
            feature: {
              include: {
                translations: true,
              },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return plans.map((plan: any) => {
      const features = plan.planFeatures.map((pf: any) => ({
        featureCode: pf.feature.featureCode,
        translations: mergeAllTranslations(pf.feature.translations),
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
        translations: mergeAllTranslations(plan.translations),
        features,
      };
    });
  }

  /**
   * Get single public plan by ID
   */
  static async getPublicPlanById(planId: number, _locale: Locale) {
    const plan: any = await prisma.pricingPlan.findFirst({
      where: {
        planId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        planFeatures: {
          where: {
            isIncluded: true,
          },
          include: {
            feature: {
              include: {
                translations: true,
              },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!plan) {
      throw new NotFoundError('Pricing plan not found');
    }

    const features = plan.planFeatures.map((pf: any) => ({
      featureCode: pf.feature.featureCode,
      translations: mergeAllTranslations(pf.feature.translations),
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
      translations: mergeAllTranslations(plan.translations),
      features,
    };
  }

  /**
   * Get all plans with all translations (Admin)
   */
  static async getAllPlans(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { planCode: { contains: search, mode: 'insensitive' } },
        { translations: { some: { planName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [total, plans]: any = await Promise.all([
      prisma.pricingPlan.count({ where }),
      prisma.pricingPlan.findMany({
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

    const result = plans.map((plan: any) => ({
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
      translations: mergeAllTranslations(plan.translations),
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

  /**
   * Create new pricing plan
   */
  static async createPlan(data: any, userId: number) {
    const {
      planCode,
      pricePerUserMonth,
      minUsers,
      maxUsers,
      displayOrder,
      badgeColor,
      translations,
    } = data;

    // Validation
    if (!planCode || !pricePerUserMonth || !minUsers || displayOrder === undefined) {
      throw new ValidationError('planCode, pricePerUserMonth, minUsers, and displayOrder are required');
    }

    if (!translations || !translations.id) {
      throw new ValidationError('Indonesian translation (id) is required');
    }

    // Check duplicate
    const existingPlan = await prisma.pricingPlan.findUnique({
      where: { planCode },
    });

    if (existingPlan) {
      throw new ValidationError('Plan code already exists');
    }

    // Create plan
    const plan: any = await prisma.pricingPlan.create({
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
              locale: Locale.id,
              planName: translations.id.planName,
              pricePeriod: translations.id.pricePeriod || null,
              userRange: translations.id.userRange || null,
              description: translations.id.description || null,
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
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
      translations: mergeAllTranslations(plan.translations),
    };
  }

  /**
   * Update pricing plan
   */
  static async updatePlan(planId: number, data: any, userId: number) {
    const {
      planCode,
      pricePerUserMonth,
      minUsers,
      maxUsers,
      displayOrder,
      badgeColor,
      isActive,
      translations,
    } = data;

    // Check exists
    const existingPlan = await prisma.pricingPlan.findUnique({
      where: { planId },
    });

    if (!existingPlan || existingPlan.deletedAt) {
      throw new NotFoundError('Pricing plan not found');
    }

    // Check duplicate planCode
    if (planCode && planCode !== existingPlan.planCode) {
      const duplicatePlan = await prisma.pricingPlan.findUnique({
        where: { planCode },
      });

      if (duplicatePlan) {
        throw new ValidationError('Plan code already exists');
      }
    }

    // Update plan
    const updateData: any = {
      updatedBy: userId,
    };

    if (planCode) updateData.planCode = planCode;
    if (pricePerUserMonth !== undefined) updateData.pricePerUserMonth = pricePerUserMonth;
    if (minUsers !== undefined) updateData.minUsers = minUsers;
    if (maxUsers !== undefined) updateData.maxUsers = maxUsers;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (badgeColor !== undefined) updateData.badgeColor = badgeColor;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.pricingPlan.update({
      where: { planId },
      data: updateData,
    });

    // Update translations if provided
    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.pricingTranslation.upsert({
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

    // Fetch updated plan
    const updatedPlan: any = await prisma.pricingPlan.findUnique({
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
      translations: mergeAllTranslations(updatedPlan.translations),
    };
  }

  /**
   * Soft delete pricing plan
   */
  static async deletePlan(planId: number, userId: number) {
    const plan = await prisma.pricingPlan.findUnique({
      where: { planId },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundError('Pricing plan not found');
    }

    await prisma.pricingPlan.update({
      where: { planId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId,
      },
    });
  }
}
