import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class ERPBenefitService {
  /**
   * Get all active ERP benefits (Public)
   */
  static async getPublicBenefits(_locale: Locale) {
    const benefits: any = await prisma.eRPBenefit.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      include: {
        translations: true,
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

    return benefits.map((benefit: any) => ({
      benefitId: benefit.benefitId,
      displayOrder: benefit.displayOrder,
      translations: mergeAllTranslations(benefit.translations),
      image: benefit.imageFile
        ? {
            fileId: benefit.imageFile.fileId,
            filePath: benefit.imageFile.filePath,
            altText: benefit.imageFile.altText
          }
        : null
    }));
  }

  /**
   * Get all benefits with all translations (Admin)
   */
  static async getAllBenefits(page: number, limit: number, search?: string, isActive?: string) {
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

    const [total, benefits]: any = await Promise.all([
      prisma.eRPBenefit.count({ where }),
      prisma.eRPBenefit.findMany({
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

    const result = benefits.map((benefit: any) => ({
      benefitId: benefit.benefitId,
      displayOrder: benefit.displayOrder,
      imageFileId: benefit.imageFileId,
      isActive: benefit.isActive,
      createdAt: benefit.createdAt,
      updatedAt: benefit.updatedAt,
      image: benefit.imageFile,
      creator: benefit.creator,
      updater: benefit.updater,
      translations: mergeAllTranslations(benefit.translations)
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
   * Create new ERP benefit
   */
  static async createBenefit(data: any, userId: number) {
    const { displayOrder, imageFileId, translations } = data;

    if (displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Generate benefitCode
    const benefitCode = `BENEFIT_${Date.now()}`;

    if (imageFileId) {
      const imageFile = await prisma.mediaFile.findUnique({
        where: { fileId: imageFileId }
      });

      if (!imageFile) {
        throw new NotFoundError("Image file not found");
      }
    }

    const benefit: any = await prisma.eRPBenefit.create({
      data: {
        benefitCode,
        displayOrder,
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
      ...benefit,
      translations: mergeAllTranslations(benefit.translations)
    };
  }

  /**
   * Update ERP benefit
   */
  static async updateBenefit(benefitId: number, data: any, userId: number) {
    const { displayOrder, imageFileId, isActive, translations } = data;

    const existing = await prisma.eRPBenefit.findUnique({
      where: { benefitId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("ERP benefit not found");
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
    if (imageFileId !== undefined) updateData.imageFileId = imageFileId;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.eRPBenefit.update({
      where: { benefitId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.eRPBenefitTranslation.upsert({
            where: {
              benefitId_locale: {
                benefitId,
                locale
              }
            },
            create: {
              benefitId,
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

    const updated: any = await prisma.eRPBenefit.findUnique({
      where: { benefitId },
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
   * Soft delete ERP benefit
   */
  static async deleteBenefit(benefitId: number, userId: number) {
    const benefit = await prisma.eRPBenefit.findUnique({
      where: { benefitId }
    });

    if (!benefit || benefit.deletedAt) {
      throw new NotFoundError("ERP benefit not found");
    }

    await prisma.eRPBenefit.update({
      where: { benefitId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
