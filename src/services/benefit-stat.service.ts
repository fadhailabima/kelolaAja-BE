import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class BenefitStatService {
  /**
   * Get all active benefit stats (Public)
   */
  static async getPublicStats(_locale: Locale) {
    const stats: any = await prisma.benefitStat.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      include: {
        translations: true
      },
      orderBy: { displayOrder: "asc" }
    });

    return stats.map((stat: any) => ({
      statId: stat.statId,
      value: stat.statValue,
      displayOrder: stat.displayOrder,
      translations: mergeAllTranslations(stat.translations)
    }));
  }

  /**
   * Get all stats with all translations (Admin)
   */
  static async getAllStats(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { statValue: { contains: search, mode: "insensitive" } },
        { translations: { some: { label: { contains: search, mode: "insensitive" } } } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [total, stats]: any = await Promise.all([
      prisma.benefitStat.count({ where }),
      prisma.benefitStat.findMany({
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

    const result = stats.map((stat: any) => ({
      statId: stat.statId,
      statValue: stat.statValue,
      displayOrder: stat.displayOrder,
      isActive: stat.isActive,
      createdAt: stat.createdAt,
      updatedAt: stat.updatedAt,
      creator: stat.creator,
      updater: stat.updater,
      translations: mergeAllTranslations(stat.translations)
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
   * Create new benefit stat
   */
  static async createStat(data: any, userId: number) {
    const { statValue, displayOrder, translations } = data;

    if (!statValue || displayOrder === undefined) {
      throw new ValidationError("statValue and displayOrder are required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Generate statCode
    const statCode = `STAT_${Date.now()}`;

    const stat: any = await prisma.benefitStat.create({
      data: {
        statCode,
        statValue,
        displayOrder,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              label: translations.id.label
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
                    label: translations.en.label
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
      ...stat,
      translations: mergeAllTranslations(stat.translations)
    };
  }

  /**
   * Update benefit stat
   */
  static async updateStat(statId: number, data: any, userId: number) {
    const { statValue, displayOrder, isActive, translations } = data;

    const existing = await prisma.benefitStat.findUnique({
      where: { statId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Benefit stat not found");
    }

    const updateData: any = { updatedBy: userId };

    if (statValue) updateData.statValue = statValue;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.benefitStat.update({
      where: { statId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.benefitStatTranslation.upsert({
            where: {
              statId_locale: {
                statId,
                locale
              }
            },
            create: {
              statId,
              locale,
              label: translations[locale].label
            },
            update: {
              label: translations[locale].label
            }
          });
        }
      }
    }

    const updated: any = await prisma.benefitStat.findUnique({
      where: { statId },
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
   * Soft delete benefit stat
   */
  static async deleteStat(statId: number, userId: number) {
    const stat = await prisma.benefitStat.findUnique({
      where: { statId }
    });

    if (!stat || stat.deletedAt) {
      throw new NotFoundError("Benefit stat not found");
    }

    await prisma.benefitStat.update({
      where: { statId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
