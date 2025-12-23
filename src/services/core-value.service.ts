import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class CoreValueService {
  /**
   * Get all active core values (Public)
   */
  static async getPublicValues(_locale: Locale) {
    const values: any = await prisma.coreValue.findMany({
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

    return values.map((value: any) => ({
      valueId: value.valueId,
      displayOrder: value.displayOrder,
      iconName: value.iconName,
      translations: mergeAllTranslations(value.translations),
      image: value.imageFile
        ? {
            fileId: value.imageFile.fileId,
            filePath: value.imageFile.filePath,
            altText: value.imageFile.altText
          }
        : null
    }));
  }

  /**
   * Get all values with all translations (Admin)
   */
  static async getAllValues(page: number, limit: number, search?: string, isActive?: string) {
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

    const [total, values]: any = await Promise.all([
      prisma.coreValue.count({ where }),
      prisma.coreValue.findMany({
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

    const result = values.map((value: any) => ({
      valueId: value.valueId,
      displayOrder: value.displayOrder,
      iconName: value.iconName,
      imageFileId: value.imageFileId,
      isActive: value.isActive,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      image: value.imageFile,
      creator: value.creator,
      updater: value.updater,
      translations: mergeAllTranslations(value.translations)
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
   * Create new core value
   */
  static async createValue(data: any, userId: number) {
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

    // Generate valueCode
    const valueCode = `CORE_VALUE_${Date.now()}`;

    const value: any = await prisma.coreValue.create({
      data: {
        valueCode,
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
      ...value,
      translations: mergeAllTranslations(value.translations)
    };
  }

  /**
   * Update core value
   */
  static async updateValue(valueId: number, data: any, userId: number) {
    const { displayOrder, iconName, imageFileId, isActive, translations } = data;

    const existing = await prisma.coreValue.findUnique({
      where: { valueId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Core value not found");
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

    await prisma.coreValue.update({
      where: { valueId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.coreValueTranslation.upsert({
            where: {
              valueId_locale: {
                valueId,
                locale
              }
            },
            create: {
              valueId,
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

    const updated: any = await prisma.coreValue.findUnique({
      where: { valueId },
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
   * Soft delete core value
   */
  static async deleteValue(valueId: number, userId: number) {
    const value = await prisma.coreValue.findUnique({
      where: { valueId }
    });

    if (!value || value.deletedAt) {
      throw new NotFoundError("Core value not found");
    }

    await prisma.coreValue.update({
      where: { valueId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
