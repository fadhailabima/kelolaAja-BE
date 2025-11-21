import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class FeatureService {
  /**
   * Get all active features for public (locale-aware)
   */
  static async getPublicFeatures(locale: Locale, category?: string) {
    const where: any = {
      isActive: true,
      deletedAt: null
    };

    if (category) {
      where.category = category;
    }

    const features: any = await prisma.featureMaster.findMany({
      where,
      include: {
        translations: {
          where: { locale }
        }
      },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }]
    });

    return features.map((feature: any) => {
      const translation = feature.translations[0] || {};
      return {
        featureId: feature.featureId,
        featureCode: feature.featureCode,
        category: feature.category,
        displayOrder: feature.displayOrder,
        featureName: translation.featureName || "",
        description: translation.description || ""
      };
    });
  }

  /**
   * Get single public feature by ID
   */
  static async getPublicFeatureById(featureId: number, locale: Locale) {
    const feature: any = await prisma.featureMaster.findFirst({
      where: {
        featureId,
        isActive: true,
        deletedAt: null
      },
      include: {
        translations: {
          where: { locale }
        }
      }
    });

    if (!feature) {
      throw new NotFoundError("Feature not found");
    }

    const translation = feature.translations[0] || {};
    return {
      featureId: feature.featureId,
      featureCode: feature.featureCode,
      category: feature.category,
      displayOrder: feature.displayOrder,
      featureName: translation.featureName || "",
      description: translation.description || ""
    };
  }

  /**
   * Get unique categories
   */
  static async getCategories() {
    const features = await prisma.featureMaster.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      select: {
        category: true
      },
      distinct: ["category"],
      orderBy: {
        category: "asc"
      }
    });

    return features.map(f => f.category);
  }

  /**
   * Get all features with all translations (Admin)
   */
  static async getAllFeatures(page: number, limit: number, search?: string, category?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { featureCode: { contains: search, mode: "insensitive" } },
        { translations: { some: { featureName: { contains: search, mode: "insensitive" } } } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [total, features]: any = await Promise.all([
      prisma.featureMaster.count({ where }),
      prisma.featureMaster.findMany({
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
        orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
        skip,
        take: limit
      })
    ]);

    const result = features.map((feature: any) => ({
      featureId: feature.featureId,
      featureCode: feature.featureCode,
      category: feature.category,
      displayOrder: feature.displayOrder,
      isActive: feature.isActive,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
      creator: feature.creator,
      updater: feature.updater,
      translations: mergeAllTranslations(feature.translations)
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

  /**
   * Create new feature
   */
  static async createFeature(data: any, userId: number) {
    const { featureCode, category, displayOrder, translations } = data;

    // Validation
    if (!featureCode || !category || displayOrder === undefined) {
      throw new ValidationError("featureCode, category, and displayOrder are required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Check duplicate
    const existingFeature = await prisma.featureMaster.findUnique({
      where: { featureCode }
    });

    if (existingFeature) {
      throw new ValidationError("Feature code already exists");
    }

    // Create feature
    const feature: any = await prisma.featureMaster.create({
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
              locale: Locale.id,
              featureName: translations.id.featureName,
              description: translations.id.description || null
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
                    featureName: translations.en.featureName,
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
      translations: mergeAllTranslations(feature.translations)
    };
  }

  /**
   * Update feature
   */
  static async updateFeature(featureId: number, data: any, userId: number) {
    const { featureCode, category, displayOrder, isActive, translations } = data;

    // Check exists
    const existingFeature = await prisma.featureMaster.findUnique({
      where: { featureId }
    });

    if (!existingFeature || existingFeature.deletedAt) {
      throw new NotFoundError("Feature not found");
    }

    // Check duplicate featureCode
    if (featureCode && featureCode !== existingFeature.featureCode) {
      const duplicateFeature = await prisma.featureMaster.findUnique({
        where: { featureCode }
      });

      if (duplicateFeature) {
        throw new ValidationError("Feature code already exists");
      }
    }

    // Update feature
    const updateData: any = {
      updatedBy: userId
    };

    if (featureCode) updateData.featureCode = featureCode;
    if (category) updateData.category = category;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.featureMaster.update({
      where: { featureId },
      data: updateData
    });

    // Update translations if provided
    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.featureTranslation.upsert({
            where: {
              featureId_locale: {
                featureId,
                locale
              }
            },
            create: {
              featureId,
              locale,
              featureName: translations[locale].featureName,
              description: translations[locale].description || null
            },
            update: {
              featureName: translations[locale].featureName,
              description: translations[locale].description || null
            }
          });
        }
      }
    }

    // Fetch updated feature
    const updatedFeature: any = await prisma.featureMaster.findUnique({
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
      ...updatedFeature,
      translations: mergeAllTranslations(updatedFeature.translations)
    };
  }

  /**
   * Soft delete feature
   */
  static async deleteFeature(featureId: number, userId: number) {
    const feature = await prisma.featureMaster.findUnique({
      where: { featureId }
    });

    if (!feature || feature.deletedAt) {
      throw new NotFoundError("Feature not found");
    }

    await prisma.featureMaster.update({
      where: { featureId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
