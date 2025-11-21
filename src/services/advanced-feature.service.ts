import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class AdvancedFeatureService {
  /**
   * Get all active advanced features (Public)
   */
  static async getPublicFeatures(locale: Locale) {
    const features: any = await prisma.advancedFeature.findMany({
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

    return features.map((feature: any) => {
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
      prisma.advancedFeature.count({ where }),
      prisma.advancedFeature.findMany({
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

    const result = features.map((feature: any) => ({
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
   * Create new advanced feature
   */
  static async createFeature(data: any, userId: number) {
    const { displayOrder, linkUrl, imageFileId, translations } = data;

    if (displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    if (imageFileId) {
      const imageFile = await prisma.mediaFile.findUnique({
        where: { fileId: imageFileId }
      });

      if (!imageFile) {
        throw new NotFoundError("Image file not found");
      }
    }

    // Generate featureCode
    const featureCode = `ADV_FEATURE_${Date.now()}`;

    const feature: any = await prisma.advancedFeature.create({
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
      translations: mergeAllTranslations(feature.translations)
    };
  }

  /**
   * Update advanced feature
   */
  static async updateFeature(featureId: number, data: any, userId: number) {
    const { displayOrder, linkUrl, imageFileId, isActive, translations } = data;

    const existing = await prisma.advancedFeature.findUnique({
      where: { featureId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Advanced feature not found");
    }

    if (imageFileId) {
      const imageFile = await prisma.mediaFile.findUnique({
        where: { fileId: imageFileId }
      });

      if (!imageFile) {
        throw new NotFoundError("Image file not found");
      }
    }

    const updateData: any = { updatedBy: userId };

    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (imageFileId !== undefined) updateData.imageFileId = imageFileId;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.advancedFeature.update({
      where: { featureId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.advancedFeatureTranslation.upsert({
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

    const updated: any = await prisma.advancedFeature.findUnique({
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
      translations: mergeAllTranslations(updated.translations)
    };
  }

  /**
   * Soft delete advanced feature
   */
  static async deleteFeature(featureId: number, userId: number) {
    const feature = await prisma.advancedFeature.findUnique({
      where: { featureId }
    });

    if (!feature || feature.deletedAt) {
      throw new NotFoundError("Advanced feature not found");
    }

    await prisma.advancedFeature.update({
      where: { featureId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
