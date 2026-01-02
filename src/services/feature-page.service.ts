import { Locale } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { NotFoundError, ValidationError } from "../utils/errors";
import { mergeAllTranslations } from "../utils/translation";

type PageTranslationInput = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutDescription1?: string;
  aboutDescription2?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
};

type ItemTranslationInput = {
  title?: string;
  description?: string;
  shortDescription?: string;
};

type CreatePagePayload = {
  featureId: number;
  pageCode: string;
  slug: string;
  heroImageFileId?: number | null;
  isActive?: boolean;
  translations: Partial<Record<Locale, PageTranslationInput>>;
};

type UpdatePagePayload = Partial<CreatePagePayload>;

type CreateItemPayload = {
  itemType?: string | null;
  imageFileId?: number | null;
  displayOrder: number;
  isActive?: boolean;
  translations: Partial<Record<Locale, ItemTranslationInput>>;
};

type UpdateItemPayload = Partial<CreateItemPayload>;

export class FeaturePageService {
  private static normalizeTranslations(translations?: Array<{ locale: string }>): Array<Record<string, any> & { locale: Locale }> {
    if (!translations) {
      return [];
    }

    return translations.map(translation => ({
      ...(translation as Record<string, any>),
      locale: (translation.locale as Locale) || Locale.id
    }));
  }

  private static async ensurePage(pageId: number) {
    const page = await prisma.featurePage.findUnique({
      where: { pageId }
    });

    if (!page || page.deletedAt) {
      throw new NotFoundError("Feature page not found");
    }

    return page;
  }

  private static async ensureFeature(featureId: number) {
    const feature = await prisma.featureMaster.findUnique({
      where: { featureId }
    });

    if (!feature || feature.deletedAt) {
      throw new ValidationError("Feature master not found");
    }

    return feature;
  }

  private static async ensureMedia(fileId: number) {
    const file = await prisma.mediaFile.findUnique({
      where: { fileId }
    });

    if (!file || file.deletedAt) {
      throw new ValidationError("Media file not found");
    }

    return file;
  }

  private static formatPagePublic(page: any) {
    return {
      pageId: page.pageId,
      pageCode: page.pageCode,
      slug: page.slug,
      featureId: page.featureId,
      heroImage: page.heroImageFile
        ? {
            fileId: page.heroImageFile.fileId,
            filePath: page.heroImageFile.filePath,
            altText: page.heroImageFile.altText
          }
        : null,
      translations: mergeAllTranslations(page.translations)
    };
  }

  private static formatItemPublic(item: any) {
    return {
      itemId: item.itemId,
      itemType: item.itemType,
      displayOrder: item.displayOrder,
      translations: mergeAllTranslations(item.translations),
      image: item.imageFile
        ? {
            fileId: item.imageFile.fileId,
            filePath: item.imageFile.filePath,
            altText: item.imageFile.altText
          }
        : null
    };
  }

  /**
   * Public - list pages
   */
  static async getPublicPages(_locale: Locale, featureId?: number) {
    const pages = await prisma.featurePage.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        ...(featureId ? { featureId } : {})
      },
      include: {
        translations: true,
        heroImageFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return pages.map(page => this.formatPagePublic(page));
  }

  /**
   * Public - get single page by slug
   */
  static async getPublicPageBySlug(slug: string, _locale: Locale) {
    const page = await prisma.featurePage.findFirst({
      where: {
        slug,
        deletedAt: null,
        isActive: true
      },
      include: {
        translations: true,
        heroImageFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true
          }
        },
        items: {
          where: { isActive: true },
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
        }
      }
    });

    if (!page) {
      throw new NotFoundError("Feature page not found");
    }

    const base = this.formatPagePublic(page);
    return {
      ...base,
      items: page.items.map(item => this.formatItemPublic(item))
    };
  }

  /**
   * Admin - list pages
   */
  static async getPages(page: number, limit: number, search?: string, featureId?: number, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { pageCode: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        {
          translations: {
            some: {
              OR: [
                { heroTitle: { contains: search, mode: "insensitive" } },
                { heroSubtitle: { contains: search, mode: "insensitive" } },
                { aboutTitle: { contains: search, mode: "insensitive" } }
              ]
            }
          }
        }
      ];
    }

    if (featureId) {
      where.featureId = featureId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [total, pages] = await Promise.all([
      prisma.featurePage.count({ where }),
      prisma.featurePage.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: "asc" }
          },
          heroImageFile: {
            select: {
              fileId: true,
              filePath: true,
              altText: true
            }
          },
          featureMaster: {
            select: {
              featureId: true,
              featureCode: true
            }
          },
          items: {
            select: {
              itemId: true
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    const data = pages.map(pageRecord => ({
      pageId: pageRecord.pageId,
      feature: pageRecord.featureMaster,
      pageCode: pageRecord.pageCode,
      slug: pageRecord.slug,
      isActive: pageRecord.isActive,
      heroImage: pageRecord.heroImageFile,
      itemsCount: pageRecord.items.length,
      createdAt: pageRecord.createdAt,
      updatedAt: pageRecord.updatedAt,
      creator: pageRecord.creator,
      updater: pageRecord.updater,
      translations: mergeAllTranslations(this.normalizeTranslations(pageRecord.translations))
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin - detail
   */
  static async getPageDetail(pageId: number) {
    const page = await prisma.featurePage.findUnique({
      where: { pageId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        },
        heroImageFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true
          }
        },
        featureMaster: {
          select: {
            featureId: true,
            featureCode: true
          }
        },
        items: {
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
            }
          },
          orderBy: { displayOrder: "asc" }
        }
      }
    });

    if (!page || page.deletedAt) {
      throw new NotFoundError("Feature page not found");
    }

    return {
      pageId: page.pageId,
      feature: page.featureMaster,
      pageCode: page.pageCode,
      slug: page.slug,
      heroImage: page.heroImageFile,
      isActive: page.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(page.translations)),
      items: page.items.map(item => ({
        itemId: item.itemId,
        itemType: item.itemType,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        image: item.imageFile,
        translations: mergeAllTranslations(this.normalizeTranslations(item.translations))
      }))
    };
  }

  /**
   * Create page
   */
  static async createPage(data: CreatePagePayload, userId: number) {
    if (!data.featureId || !data.pageCode || !data.slug) {
      throw new ValidationError("featureId, pageCode, and slug are required");
    }

    if (!data.translations || !data.translations[Locale.id]) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    await this.ensureFeature(data.featureId);

    const existing = await prisma.featurePage.findFirst({
      where: {
        OR: [{ pageCode: data.pageCode }, { slug: data.slug }]
      }
    });

    if (existing) {
      throw new ValidationError("Page code or slug already exists");
    }

    if (data.heroImageFileId) {
      await this.ensureMedia(data.heroImageFileId);
    }

    const page = await prisma.featurePage.create({
      data: {
        featureId: data.featureId,
        pageCode: data.pageCode,
        slug: data.slug,
        heroImageFileId: data.heroImageFileId || null,
        isActive: data.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: this.buildPageTranslationPayload(data.translations)
        }
      },
      include: {
        translations: true,
        heroImageFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true
          }
        },
        featureMaster: {
          select: {
            featureId: true,
            featureCode: true
          }
        }
      }
    });

    return {
      pageId: page.pageId,
      feature: page.featureMaster,
      pageCode: page.pageCode,
      slug: page.slug,
      heroImage: page.heroImageFile,
      isActive: page.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(page.translations))
    };
  }

  private static buildPageTranslationPayload(translations: Partial<Record<Locale, PageTranslationInput>>) {
    const payload: any[] = [];
    for (const locale of Object.values(Locale)) {
      const localeData = translations?.[locale];
      if (localeData) {
        payload.push({
          locale,
          heroTitle: localeData.heroTitle || null,
          heroSubtitle: localeData.heroSubtitle || null,
          heroDescription: localeData.heroDescription || null,
          aboutTitle: localeData.aboutTitle || null,
          aboutSubtitle: localeData.aboutSubtitle || null,
          aboutDescription1: localeData.aboutDescription1 || null,
          aboutDescription2: localeData.aboutDescription2 || null,
          ctaTitle: localeData.ctaTitle || null,
          ctaDescription: localeData.ctaDescription || null,
          ctaButtonText: localeData.ctaButtonText || null
        });
      }
    }
    return payload;
  }

  /**
   * Update page
   */
  static async updatePage(pageId: number, data: UpdatePagePayload, userId: number) {
    const page = await this.ensurePage(pageId);
    const updateData: any = {
      updatedBy: userId
    };

    if (data.featureId && data.featureId !== page.featureId) {
      await this.ensureFeature(data.featureId);
      updateData.featureId = data.featureId;
    }

    if (data.pageCode && data.pageCode !== page.pageCode) {
      const duplicateCode = await prisma.featurePage.findFirst({
        where: {
          pageCode: data.pageCode,
          pageId: { not: pageId }
        }
      });

      if (duplicateCode) {
        throw new ValidationError("Page code already exists");
      }
      updateData.pageCode = data.pageCode;
    }

    if (data.slug && data.slug !== page.slug) {
      const duplicateSlug = await prisma.featurePage.findFirst({
        where: {
          slug: data.slug,
          pageId: { not: pageId }
        }
      });
      if (duplicateSlug) {
        throw new ValidationError("Slug already exists");
      }
      updateData.slug = data.slug;
    }

    if (data.heroImageFileId !== undefined) {
      if (data.heroImageFileId) {
        await this.ensureMedia(data.heroImageFileId);
        updateData.heroImageFileId = data.heroImageFileId;
      } else {
        updateData.heroImageFileId = null;
      }
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    await prisma.featurePage.update({
      where: { pageId },
      data: updateData
    });

    if (data.translations) {
      for (const locale of Object.values(Locale)) {
        const localeData = data.translations[locale];
        if (localeData) {
          await prisma.featurePageTranslation.upsert({
            where: {
              pageId_locale: {
                pageId,
                locale
              }
            },
            create: {
              pageId,
              locale,
              heroTitle: localeData.heroTitle || null,
              heroSubtitle: localeData.heroSubtitle || null,
              heroDescription: localeData.heroDescription || null,
              aboutTitle: localeData.aboutTitle || null,
              aboutSubtitle: localeData.aboutSubtitle || null,
              aboutDescription1: localeData.aboutDescription1 || null,
              aboutDescription2: localeData.aboutDescription2 || null,
              ctaTitle: localeData.ctaTitle || null,
              ctaDescription: localeData.ctaDescription || null,
              ctaButtonText: localeData.ctaButtonText || null
            },
            update: {
              heroTitle: localeData.heroTitle || null,
              heroSubtitle: localeData.heroSubtitle || null,
              heroDescription: localeData.heroDescription || null,
              aboutTitle: localeData.aboutTitle || null,
              aboutSubtitle: localeData.aboutSubtitle || null,
              aboutDescription1: localeData.aboutDescription1 || null,
              aboutDescription2: localeData.aboutDescription2 || null,
              ctaTitle: localeData.ctaTitle || null,
              ctaDescription: localeData.ctaDescription || null,
              ctaButtonText: localeData.ctaButtonText || null
            }
          });
        }
      }
    }

    return this.getPageDetail(pageId);
  }

  /**
   * Delete page (soft delete)
   */
  static async deletePage(pageId: number, userId: number) {
    await this.ensurePage(pageId);

    await prisma.featurePage.update({
      where: { pageId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }

  /**
   * List page items
   */
  static async listItems(pageId: number) {
    await this.ensurePage(pageId);

    const items = await prisma.featurePageItem.findMany({
      where: { pageId },
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
        }
      },
      orderBy: { displayOrder: "asc" }
    });

    return items.map(item => ({
      itemId: item.itemId,
      itemType: item.itemType,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
      image: item.imageFile,
      translations: mergeAllTranslations(this.normalizeTranslations(item.translations))
    }));
  }

  /**
   * Create item
   */
  static async createItem(pageId: number, data: CreateItemPayload) {
    await this.ensurePage(pageId);

    if (data.displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!data.translations || !data.translations[Locale.id]) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    if (data.imageFileId) {
      await this.ensureMedia(data.imageFileId);
    }

    const item = await prisma.featurePageItem.create({
      data: {
        pageId,
        itemType: data.itemType || null,
        imageFileId: data.imageFileId || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive ?? true,
        translations: {
          create: this.buildItemTranslationPayload(data.translations)
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
        }
      }
    });

    return {
      itemId: item.itemId,
      itemType: item.itemType,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
      image: item.imageFile,
      translations: mergeAllTranslations(this.normalizeTranslations(item.translations))
    };
  }

  private static buildItemTranslationPayload(translations: Partial<Record<Locale, ItemTranslationInput>>) {
    const payload: any[] = [];
    for (const locale of Object.values(Locale)) {
      const localeData = translations?.[locale];
      if (localeData) {
        payload.push({
          locale,
          title: localeData.title || null,
          description: localeData.description || null,
          shortDescription: localeData.shortDescription || null
        });
      }
    }
    return payload;
  }

  /**
   * Update item
   */
  static async updateItem(itemId: number, data: UpdateItemPayload) {
    const item = await prisma.featurePageItem.findUnique({
      where: { itemId },
      include: {
        translations: true
      }
    });

    if (!item) {
      throw new NotFoundError("Feature page item not found");
    }

    const updateData: any = {};
    if (data.itemType !== undefined) updateData.itemType = data.itemType;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.imageFileId !== undefined) {
      if (data.imageFileId) {
        await this.ensureMedia(data.imageFileId);
        updateData.imageFileId = data.imageFileId;
      } else {
        updateData.imageFileId = null;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.featurePageItem.update({
        where: { itemId },
        data: updateData
      });
    }

    if (data.translations) {
      for (const locale of Object.values(Locale)) {
        const localeData = data.translations[locale];
        if (localeData) {
          await prisma.featurePageItemTranslation.upsert({
            where: {
              itemId_locale: {
                itemId,
                locale
              }
            },
            create: {
              itemId,
              locale,
              title: localeData.title || null,
              description: localeData.description || null,
              shortDescription: localeData.shortDescription || null
            },
            update: {
              title: localeData.title || null,
              description: localeData.description || null,
              shortDescription: localeData.shortDescription || null
            }
          });
        }
      }
    }

    const updated = await prisma.featurePageItem.findUnique({
      where: { itemId },
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
        }
      }
    });

    return {
      itemId: updated!.itemId,
      itemType: updated!.itemType,
      displayOrder: updated!.displayOrder,
      isActive: updated!.isActive,
      image: updated!.imageFile,
      translations: mergeAllTranslations(this.normalizeTranslations(updated!.translations))
    };
  }

  /**
   * Delete item
   */
  static async deleteItem(itemId: number) {
    const item = await prisma.featurePageItem.findUnique({
      where: { itemId }
    });

    if (!item) {
      throw new NotFoundError("Feature page item not found");
    }

    await prisma.featurePageItemTranslation.deleteMany({
      where: { itemId }
    });

    await prisma.featurePageItem.delete({
      where: { itemId }
    });
  }
}
