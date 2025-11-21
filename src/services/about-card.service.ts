import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class AboutCardService {
  /**
   * Get all active about cards (Public)
   */
  static async getPublicCards(locale: Locale) {
    const cards: any = await prisma.aboutCard.findMany({
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

    return cards.map((card: any) => {
      const translation = card.translations[0] || {};
      return {
        cardId: card.cardId,
        displayOrder: card.displayOrder,
        cardLink: card.cardLink,
        title: translation.title || "",
        description: translation.description || "",
        image: card.imageFile
          ? {
              fileId: card.imageFile.fileId,
              filePath: card.imageFile.filePath,
              altText: card.imageFile.altText
            }
          : null
      };
    });
  }

  /**
   * Get all cards with all translations (Admin)
   */
  static async getAllCards(page: number, limit: number, search?: string, isActive?: string) {
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

    const [total, cards]: any = await Promise.all([
      prisma.aboutCard.count({ where }),
      prisma.aboutCard.findMany({
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

    const result = cards.map((card: any) => ({
      cardId: card.cardId,
      displayOrder: card.displayOrder,
      cardLink: card.cardLink,
      imageFileId: card.imageFileId,
      isActive: card.isActive,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      image: card.imageFile,
      creator: card.creator,
      updater: card.updater,
      translations: mergeAllTranslations(card.translations)
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
   * Create new about card
   */
  static async createCard(data: any, userId: number) {
    const { displayOrder, cardLink, imageFileId, translations } = data;

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

    // Generate cardCode
    const cardCode = `ABOUT_${Date.now()}`;

    const card: any = await prisma.aboutCard.create({
      data: {
        cardCode,
        displayOrder,
        cardLink: cardLink || null,
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
      ...card,
      translations: mergeAllTranslations(card.translations)
    };
  }

  /**
   * Update about card
   */
  static async updateCard(cardId: number, data: any, userId: number) {
    const { displayOrder, cardLink, imageFileId, isActive, translations } = data;

    const existing = await prisma.aboutCard.findUnique({
      where: { cardId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("About card not found");
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
    if (cardLink !== undefined) updateData.cardLink = cardLink;
    if (imageFileId !== undefined) updateData.imageFileId = imageFileId;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.aboutCard.update({
      where: { cardId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.aboutCardTranslation.upsert({
            where: {
              cardId_locale: {
                cardId,
                locale
              }
            },
            create: {
              cardId,
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

    const updated: any = await prisma.aboutCard.findUnique({
      where: { cardId },
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
   * Soft delete about card
   */
  static async deleteCard(cardId: number, userId: number) {
    const card = await prisma.aboutCard.findUnique({
      where: { cardId }
    });

    if (!card || card.deletedAt) {
      throw new NotFoundError("About card not found");
    }

    await prisma.aboutCard.update({
      where: { cardId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
