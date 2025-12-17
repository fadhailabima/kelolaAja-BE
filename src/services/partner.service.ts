import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class PartnerService {
  /**
   * Get all active partners for public (locale-aware)
   */
  static async getPublicPartners(locale: Locale) {
    const partners: any = await prisma.partner.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      include: {
        translations: {
          where: { locale }
        },
        logoFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true
          }
        }
      },
      orderBy: { displayOrder: "asc" }
    });

    return partners.map((partner: any) => {
      const translation = partner.translations[0] || {};
      return {
        partnerId: partner.partnerId,
        partnerName: partner.partnerName,
        displayOrder: partner.displayOrder,
        description: translation.description || "",
        logo: partner.logoFile
          ? {
            fileId: partner.logoFile.fileId,
            filePath: partner.logoFile.filePath,
            altText: partner.logoFile.altText
          }
          : null
      };
    });
  }

  /**
   * Get all partners with all translations (Admin)
   */
  static async getAllPartners(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { partnerName: { contains: search, mode: "insensitive" } },
        { translations: { some: { description: { contains: search, mode: "insensitive" } } } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [total, partners]: any = await Promise.all([
      prisma.partner.count({ where }),
      prisma.partner.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: "asc" }
          },
          logoFile: {
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

    const result = partners.map((partner: any) => ({
      partnerId: partner.partnerId,
      partnerName: partner.partnerName,
      logoFileId: partner.logoFileId,
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
      logo: partner.logoFile,
      creator: partner.creator,
      updater: partner.updater,
      translations: mergeAllTranslations(partner.translations)
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
   * Create new partner
   */
  static async createPartner(data: any, userId: number) {
    const { partnerName, logoFileId, websiteUrl, displayOrder, translations } = data;

    // Validation
    if (!partnerName || displayOrder === undefined) {
      throw new ValidationError("partnerName and displayOrder are required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Verify logo file exists if provided
    if (logoFileId) {
      const logoFile = await prisma.mediaFile.findUnique({
        where: { fileId: logoFileId }
      });

      if (!logoFile) {
        throw new NotFoundError("Logo file not found");
      }
    }

    // Create partner
    const partner: any = await prisma.partner.create({
      data: {
        partnerName,
        logoFileId: logoFileId || null,
        websiteUrl: websiteUrl || null,
        displayOrder,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              description: translations.id.description || null
            },
            ...(translations.en
              ? [
                {
                  locale: Locale.en,
                  description: translations.en.description || null
                }
              ]
              : [])
          ]
        }
      },
      include: {
        translations: true,
        logoFile: {
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
      ...partner,
      translations: mergeAllTranslations(partner.translations)
    };
  }

  /**
   * Update partner
   */
  static async updatePartner(partnerId: number, data: any, userId: number) {
    const { partnerName, logoFileId, websiteUrl, displayOrder, isActive, translations } = data;

    // Check exists
    const existingPartner = await prisma.partner.findUnique({
      where: { partnerId }
    });

    if (!existingPartner || existingPartner.deletedAt) {
      throw new NotFoundError("Partner not found");
    }

    // Verify logo file exists if provided
    if (logoFileId) {
      const logoFile = await prisma.mediaFile.findUnique({
        where: { fileId: logoFileId }
      });

      if (!logoFile) {
        throw new NotFoundError("Logo file not found");
      }
    }

    // Update partner
    const updateData: any = {
      updatedBy: userId
    };

    if (partnerName) updateData.partnerName = partnerName;
    if (logoFileId !== undefined) updateData.logoFileId = logoFileId;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.partner.update({
      where: { partnerId },
      data: updateData
    });

    // Update translations if provided
    if (translations) {
      const transData = translations as Record<string, any>;
      // Iterate strictly over the keys present in the payload
      for (const localeKey of Object.keys(transData)) {
        // Validate if key is a valid Locale
        if (Object.values(Locale).includes(localeKey as Locale)) {
          const locale = localeKey as Locale;
          await prisma.partnerTranslation.upsert({
            where: {
              partnerId_locale: {
                partnerId,
                locale
              }
            },
            create: {
              partnerId,
              locale,
              description: transData[locale].description || null
            },
            update: {
              description: transData[locale].description || null
            }
          });
        }
      }
    }

    // Fetch updated partner
    const updatedPartner: any = await prisma.partner.findUnique({
      where: { partnerId },
      include: {
        translations: true,
        logoFile: {
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
      ...updatedPartner,
      translations: mergeAllTranslations(updatedPartner.translations)
    };
  }

  /**
   * Soft delete partner
   */
  static async deletePartner(partnerId: number, userId: number) {
    const partner = await prisma.partner.findUnique({
      where: { partnerId }
    });

    if (!partner || partner.deletedAt) {
      throw new NotFoundError("Partner not found");
    }

    await prisma.partner.update({
      where: { partnerId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
