import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class OurPhilosophyService {
  /**
   * Get all active philosophies (Public)
   */
  static async getPublicPhilosophies(_locale: Locale) {
    const philosophies: any = await prisma.ourPhilosophy.findMany({
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

    return philosophies.map((philosophy: any) => {
      return {
        philosophyId: philosophy.philosophyId,
        displayOrder: philosophy.displayOrder,
        iconName: philosophy.iconName,
        translations: mergeAllTranslations(philosophy.translations),
        image: philosophy.imageFile
          ? {
              fileId: philosophy.imageFile.fileId,
              filePath: philosophy.imageFile.filePath,
              altText: philosophy.imageFile.altText
            }
          : null
      };
    });
  }

  /**
   * Get all philosophies with all translations (Admin)
   */
  static async getAllPhilosophies(page: number, limit: number, search?: string, isActive?: string) {
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

    const [total, philosophies]: any = await Promise.all([
      prisma.ourPhilosophy.count({ where }),
      prisma.ourPhilosophy.findMany({
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

    const result = philosophies.map((philosophy: any) => ({
      philosophyId: philosophy.philosophyId,
      displayOrder: philosophy.displayOrder,
      iconName: philosophy.iconName,
      imageFileId: philosophy.imageFileId,
      isActive: philosophy.isActive,
      createdAt: philosophy.createdAt,
      updatedAt: philosophy.updatedAt,
      image: philosophy.imageFile,
      creator: philosophy.creator,
      updater: philosophy.updater,
      translations: mergeAllTranslations(philosophy.translations)
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
   * Create new philosophy
   */
  static async createPhilosophy(data: any, userId: number) {
    const { displayOrder, iconName, imageFileId, translations } = data;

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

    // Generate philosophyCode
    const philosophyCode = `PHILOSOPHY_${Date.now()}`;

    const philosophy: any = await prisma.ourPhilosophy.create({
      data: {
        philosophyCode,
        displayOrder,
        iconName: iconName || null,
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
      ...philosophy,
      translations: mergeAllTranslations(philosophy.translations)
    };
  }

  /**
   * Update philosophy
   */
  static async updatePhilosophy(philosophyId: number, data: any, userId: number) {
    const { displayOrder, iconName, imageFileId, isActive, translations } = data;

    const existing = await prisma.ourPhilosophy.findUnique({
      where: { philosophyId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Philosophy not found");
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
    if (iconName !== undefined) updateData.iconName = iconName;
    if (imageFileId !== undefined) updateData.imageFileId = imageFileId;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.ourPhilosophy.update({
      where: { philosophyId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.ourPhilosophyTranslation.upsert({
            where: {
              philosophyId_locale: {
                philosophyId,
                locale
              }
            },
            create: {
              philosophyId,
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

    const updated: any = await prisma.ourPhilosophy.findUnique({
      where: { philosophyId },
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
   * Soft delete philosophy
   */
  static async deletePhilosophy(philosophyId: number, userId: number) {
    const philosophy = await prisma.ourPhilosophy.findUnique({
      where: { philosophyId }
    });

    if (!philosophy || philosophy.deletedAt) {
      throw new NotFoundError("Philosophy not found");
    }

    await prisma.ourPhilosophy.update({
      where: { philosophyId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
