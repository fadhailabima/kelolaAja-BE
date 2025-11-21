import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class KelolaAjaFeatureService {
  /**
   * Get all active KelolaAja features (Public)
   */
  static async getPublicFeatures(locale: Locale) {
    const features: any = await prisma.kelolaAjaFeature.findMany({
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

    return features.map((feature: any) => {
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

  /**
   * Get all features with all translations (Admin)
   */
  static async getAllFeatures(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

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

    const [total, features]: any = await Promise.all([
      prisma.kelolaAjaFeature.count({ where }),
      prisma.kelolaAjaFeature.findMany({
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

    const result = features.map((feature: any) => ({
      featureId: feature.featureId,
      displayOrder: feature.displayOrder,
      iconName: feature.iconName,
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
   * Create new KelolaAja feature
   */
  static async createFeature(data: any, userId: number) {
    const { displayOrder, iconName, translations } = data;

    if (displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Generate featureCode
    const featureCode = `KELOLA_FEATURE_${Date.now()}`;

    const feature: any = await prisma.kelolaAjaFeature.create({
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
              locale: Locale.id,
              title: translations.id.title,
              description: translations.id.description || null
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
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
      translations: mergeAllTranslations(feature.translations)
    };
  }

  /**
   * Update KelolaAja feature
   */
  static async updateFeature(featureId: number, data: any, userId: number) {
    const { displayOrder, iconName, isActive, translations } = data;

    const existing = await prisma.kelolaAjaFeature.findUnique({
      where: { featureId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("KelolaAja feature not found");
    }

    const updateData: any = { updatedBy: userId };

    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (iconName !== undefined) updateData.iconName = iconName;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.kelolaAjaFeature.update({
      where: { featureId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.kelolaAjaFeatureTranslation.upsert({
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

    const updated: any = await prisma.kelolaAjaFeature.findUnique({
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
      translations: mergeAllTranslations(updated.translations)
    };
  }

  /**
   * Soft delete KelolaAja feature
   */
  static async deleteFeature(featureId: number, userId: number) {
    const feature = await prisma.kelolaAjaFeature.findUnique({
      where: { featureId }
    });

    if (!feature || feature.deletedAt) {
      throw new NotFoundError("KelolaAja feature not found");
    }

    await prisma.kelolaAjaFeature.update({
      where: { featureId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
