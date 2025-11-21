import { Locale } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { NotFoundError, ValidationError } from "../utils/errors";
import { extractTranslation, mergeAllTranslations } from "../utils/translation";

type IndustryTranslationInput = {
  title?: string;
  description?: string;
  introText?: string;
};

type ProblemSolutionTranslationInput = {
  title?: string;
  description?: string;
};

type CreateIndustryPayload = {
  industryCode: string;
  slug: string;
  displayOrder: number;
  isActive?: boolean;
  translations: Partial<Record<Locale, IndustryTranslationInput>>;
};

type UpdateIndustryPayload = Partial<CreateIndustryPayload>;

type ProblemPayload = {
  displayOrder: number;
  isActive?: boolean;
  translations: Partial<Record<Locale, ProblemSolutionTranslationInput>>;
};

type UpdateProblemPayload = Partial<ProblemPayload>;

type MediaPayload = {
  fileId: number;
  mediaType?: string | null;
  usage?: string | null;
  displayOrder?: number | null;
};

type UpdateMediaPayload = Partial<MediaPayload>;

export class IndustryService {
  /**
   * Helper to ensure industry exists and not deleted
   */
  private static async ensureIndustry(industryId: number) {
    const industry = await prisma.industry.findUnique({
      where: { industryId }
    });

    if (!industry || industry.deletedAt) {
      throw new NotFoundError("Industry not found");
    }

    return industry;
  }

  /**
   * Convert translation array locale type to Prisma Locale enum
   */
  private static normalizeTranslations(translations?: Array<{ locale: string }>): Array<Record<string, any> & { locale: Locale }> {
    if (!translations) {
      return [];
    }

    return translations.map(translation => ({
      ...(translation as Record<string, any>),
      locale: (translation.locale as Locale) || Locale.id
    }));
  }

  /**
   * Public formatter for problems/solutions
   */
  private static formatContentPublic(item: any, locale: Locale) {
    const translation = extractTranslation(this.normalizeTranslations(item.translations), locale) || {};
    return {
      id: item.problemId ?? item.solutionId,
      displayOrder: item.displayOrder,
      title: translation.title || "",
      description: translation.description || ""
    };
  }

  /**
   * Public formatter for industry
   */
  private static formatIndustryPublic(industry: any, locale: Locale) {
    const translation = extractTranslation(this.normalizeTranslations(industry.translations), locale) || {};

    return {
      industryId: industry.industryId,
      industryCode: industry.industryCode,
      slug: industry.slug,
      displayOrder: industry.displayOrder,
      title: translation?.title || "",
      description: translation?.description || "",
      introText: translation?.introText || "",
      problems: (industry.problems || []).map((problem: any) => this.formatContentPublic(problem, locale)),
      solutions: (industry.solutions || []).map((solution: any) => this.formatContentPublic(solution, locale)),
      media: (industry.media || []).map((mediaItem: any) => ({
        industryMediaId: mediaItem.industryMediaId,
        mediaType: mediaItem.mediaType,
        usage: mediaItem.usage,
        displayOrder: mediaItem.displayOrder,
        file: mediaItem.mediaFile
          ? {
              fileId: mediaItem.mediaFile.fileId,
              filePath: mediaItem.mediaFile.filePath,
              fileName: mediaItem.mediaFile.fileName,
              altText: mediaItem.mediaFile.altText
            }
          : null
      }))
    };
  }

  /**
   * Build industry translation payload for create
   */
  private static buildIndustryTranslationPayload(translations: Partial<Record<Locale, IndustryTranslationInput>>) {
    const payload: any[] = [];
    for (const locale of Object.values(Locale)) {
      const localeData = translations?.[locale];
      if (localeData) {
        payload.push({
          locale,
          title: localeData.title || null,
          description: localeData.description || null,
          introText: localeData.introText || null
        });
      }
    }
    return payload;
  }

  /**
   * Build translation payload for problems/solutions
   */
  private static buildTranslationPayload(translations: Partial<Record<Locale, ProblemSolutionTranslationInput>>) {
    const payload: any[] = [];
    for (const locale of Object.values(Locale)) {
      const localeData = translations?.[locale];
      if (localeData) {
        payload.push({
          locale,
          title: localeData.title || null,
          description: localeData.description || null
        });
      }
    }
    return payload;
  }

  /**
   * List industries for public landing
   */
  static async getPublicIndustries(locale: Locale) {
    const industries = await prisma.industry.findMany({
      where: {
        deletedAt: null,
        isActive: true
      },
      include: {
        translations: true,
        problems: {
          where: { isActive: true },
          include: {
            translations: true
          },
          orderBy: { displayOrder: "asc" }
        },
        solutions: {
          where: { isActive: true },
          include: {
            translations: true
          },
          orderBy: { displayOrder: "asc" }
        },
        media: {
          orderBy: { displayOrder: "asc" },
          include: {
            mediaFile: {
              select: {
                fileId: true,
                filePath: true,
                fileName: true,
                altText: true
              }
            }
          }
        }
      },
      orderBy: { displayOrder: "asc" }
    });

    return industries.map(industry => this.formatIndustryPublic(industry, locale));
  }

  /**
   * Get single public industry by slug
   */
  static async getPublicIndustryBySlug(slug: string, locale: Locale) {
    const industry = await prisma.industry.findFirst({
      where: {
        slug,
        deletedAt: null,
        isActive: true
      },
      include: {
        translations: true,
        problems: {
          where: { isActive: true },
          include: { translations: true },
          orderBy: { displayOrder: "asc" }
        },
        solutions: {
          where: { isActive: true },
          include: { translations: true },
          orderBy: { displayOrder: "asc" }
        },
        media: {
          orderBy: { displayOrder: "asc" },
          include: {
            mediaFile: {
              select: {
                fileId: true,
                filePath: true,
                fileName: true,
                altText: true
              }
            }
          }
        }
      }
    });

    if (!industry) {
      throw new NotFoundError("Industry not found");
    }

    return this.formatIndustryPublic(industry, locale);
  }

  /**
   * Admin - list industries with pagination
   */
  static async getIndustries(page: number, limit: number, search?: string, isActive?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { industryCode: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        {
          translations: {
            some: {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
              ]
            }
          }
        }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [total, industries] = await Promise.all([
      prisma.industry.count({ where }),
      prisma.industry.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: "asc" }
          },
          problems: {
            include: {
              translations: {
                orderBy: { locale: "asc" }
              }
            },
            orderBy: { displayOrder: "asc" }
          },
          solutions: {
            include: {
              translations: {
                orderBy: { locale: "asc" }
              }
            },
            orderBy: { displayOrder: "asc" }
          },
          media: {
            orderBy: { displayOrder: "asc" },
            include: {
              mediaFile: {
                select: {
                  fileId: true,
                  filePath: true,
                  fileName: true,
                  altText: true
                }
              }
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

    const data = industries.map(industry => ({
      industryId: industry.industryId,
      industryCode: industry.industryCode,
      slug: industry.slug,
      displayOrder: industry.displayOrder,
      isActive: industry.isActive,
      createdAt: industry.createdAt,
      updatedAt: industry.updatedAt,
      creator: industry.creator,
      updater: industry.updater,
      translations: mergeAllTranslations(this.normalizeTranslations(industry.translations)),
      problems: industry.problems.map(problem => ({
        problemId: problem.problemId,
        displayOrder: problem.displayOrder,
        isActive: problem.isActive,
        translations: mergeAllTranslations(this.normalizeTranslations(problem.translations))
      })),
      solutions: industry.solutions.map(solution => ({
        solutionId: solution.solutionId,
        displayOrder: solution.displayOrder,
        isActive: solution.isActive,
        translations: mergeAllTranslations(this.normalizeTranslations(solution.translations))
      })),
      media: industry.media.map(mediaItem => ({
        industryMediaId: mediaItem.industryMediaId,
        mediaType: mediaItem.mediaType,
        usage: mediaItem.usage,
        displayOrder: mediaItem.displayOrder,
        file: mediaItem.mediaFile
      }))
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
   * Admin - get detail
   */
  static async getIndustryDetail(industryId: number) {
    const industry = await prisma.industry.findUnique({
      where: { industryId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        },
        problems: {
          include: {
            translations: {
              orderBy: { locale: "asc" }
            }
          },
          orderBy: { displayOrder: "asc" }
        },
        solutions: {
          include: {
            translations: {
              orderBy: { locale: "asc" }
            }
          },
          orderBy: { displayOrder: "asc" }
        },
        media: {
          orderBy: { displayOrder: "asc" },
          include: {
            mediaFile: {
              select: {
                fileId: true,
                filePath: true,
                fileName: true,
                altText: true
              }
            }
          }
        }
      }
    });

    if (!industry || industry.deletedAt) {
      throw new NotFoundError("Industry not found");
    }

    return {
      industryId: industry.industryId,
      industryCode: industry.industryCode,
      slug: industry.slug,
      displayOrder: industry.displayOrder,
      isActive: industry.isActive,
      createdAt: industry.createdAt,
      updatedAt: industry.updatedAt,
      translations: mergeAllTranslations(this.normalizeTranslations(industry.translations)),
      problems: industry.problems.map(problem => ({
        problemId: problem.problemId,
        displayOrder: problem.displayOrder,
        isActive: problem.isActive,
        translations: mergeAllTranslations(this.normalizeTranslations(problem.translations))
      })),
      solutions: industry.solutions.map(solution => ({
        solutionId: solution.solutionId,
        displayOrder: solution.displayOrder,
        isActive: solution.isActive,
        translations: mergeAllTranslations(this.normalizeTranslations(solution.translations))
      })),
      media: industry.media.map(mediaItem => ({
        industryMediaId: mediaItem.industryMediaId,
        mediaType: mediaItem.mediaType,
        usage: mediaItem.usage,
        displayOrder: mediaItem.displayOrder,
        file: mediaItem.mediaFile
      }))
    };
  }

  /**
   * Create industry
   */
  static async createIndustry(data: CreateIndustryPayload, userId: number) {
    if (!data.industryCode || !data.slug || data.displayOrder === undefined) {
      throw new ValidationError("industryCode, slug, and displayOrder are required");
    }

    if (!data.translations || !data.translations[Locale.id]) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    const existing = await prisma.industry.findFirst({
      where: {
        OR: [{ industryCode: data.industryCode }, { slug: data.slug }]
      }
    });

    if (existing) {
      throw new ValidationError("Industry code or slug already exists");
    }

    const industry = await prisma.industry.create({
      data: {
        industryCode: data.industryCode,
        slug: data.slug,
        displayOrder: data.displayOrder,
        isActive: data.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        translations: {
          create: this.buildIndustryTranslationPayload(data.translations)
        }
      },
      include: {
        translations: true
      }
    });

    return {
      industryId: industry.industryId,
      industryCode: industry.industryCode,
      slug: industry.slug,
      displayOrder: industry.displayOrder,
      isActive: industry.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(industry.translations))
    };
  }

  /**
   * Update industry
   */
  static async updateIndustry(industryId: number, data: UpdateIndustryPayload, userId: number) {
    const industry = await this.ensureIndustry(industryId);

    const updateData: any = {
      updatedBy: userId
    };

    if (data.industryCode && data.industryCode !== industry.industryCode) {
      const duplicateCode = await prisma.industry.findFirst({
        where: {
          industryCode: data.industryCode,
          industryId: { not: industryId }
        }
      });

      if (duplicateCode) {
        throw new ValidationError("Industry code already exists");
      }

      updateData.industryCode = data.industryCode;
    }

    if (data.slug && data.slug !== industry.slug) {
      const duplicateSlug = await prisma.industry.findFirst({
        where: {
          slug: data.slug,
          industryId: { not: industryId }
        }
      });

      if (duplicateSlug) {
        throw new ValidationError("Slug already exists");
      }
      updateData.slug = data.slug;
    }

    if (data.displayOrder !== undefined) {
      updateData.displayOrder = data.displayOrder;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    await prisma.industry.update({
      where: { industryId },
      data: updateData
    });

    if (data.translations) {
      for (const locale of Object.values(Locale)) {
        const localeData = data.translations[locale];
        if (localeData) {
          await prisma.industryTranslation.upsert({
            where: {
              industryId_locale: {
                industryId,
                locale
              }
            },
            create: {
              industryId,
              locale,
              title: localeData.title || null,
              description: localeData.description || null,
              introText: localeData.introText || null
            },
            update: {
              title: localeData.title || null,
              description: localeData.description || null,
              introText: localeData.introText || null
            }
          });
        }
      }
    }

    return this.getIndustryDetail(industryId);
  }

  /**
   * Soft delete industry
   */
  static async deleteIndustry(industryId: number, userId: number) {
    await this.ensureIndustry(industryId);

    await prisma.industry.update({
      where: { industryId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }

  /**
   * List problems by industry
   */
  static async listProblems(industryId: number) {
    await this.ensureIndustry(industryId);

    const problems = await prisma.industryProblem.findMany({
      where: { industryId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        }
      },
      orderBy: { displayOrder: "asc" }
    });

    return problems.map(problem => ({
      problemId: problem.problemId,
      displayOrder: problem.displayOrder,
      isActive: problem.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(problem.translations))
    }));
  }

  /**
   * Create industry problem
   */
  static async createProblem(industryId: number, data: ProblemPayload) {
    await this.ensureIndustry(industryId);

    if (data.displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!data.translations || !data.translations[Locale.id]) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    const problem = await prisma.industryProblem.create({
      data: {
        industryId,
        displayOrder: data.displayOrder,
        isActive: data.isActive ?? true,
        translations: {
          create: this.buildTranslationPayload(data.translations)
        }
      },
      include: {
        translations: true
      }
    });

    return {
      problemId: problem.problemId,
      displayOrder: problem.displayOrder,
      isActive: problem.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(problem.translations))
    };
  }

  /**
   * Update problem
   */
  static async updateProblem(problemId: number, data: UpdateProblemPayload) {
    const problem = await prisma.industryProblem.findUnique({
      where: { problemId },
      include: {
        translations: true
      }
    });

    if (!problem) {
      throw new NotFoundError("Industry problem not found");
    }

    const updateData: any = {};
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (Object.keys(updateData).length > 0) {
      await prisma.industryProblem.update({
        where: { problemId },
        data: updateData
      });
    }

    if (data.translations) {
      for (const locale of Object.values(Locale)) {
        const localeData = data.translations[locale];
        if (localeData) {
          await prisma.industryProblemTranslation.upsert({
            where: {
              problemId_locale: {
                problemId,
                locale
              }
            },
            create: {
              problemId,
              locale,
              title: localeData.title || null,
              description: localeData.description || null
            },
            update: {
              title: localeData.title || null,
              description: localeData.description || null
            }
          });
        }
      }
    }

    const updated = await prisma.industryProblem.findUnique({
      where: { problemId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        }
      }
    });

    return {
      problemId: updated!.problemId,
      displayOrder: updated!.displayOrder,
      isActive: updated!.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(updated!.translations))
    };
  }

  /**
   * Delete problem
   */
  static async deleteProblem(problemId: number) {
    const problem = await prisma.industryProblem.findUnique({
      where: { problemId }
    });

    if (!problem) {
      throw new NotFoundError("Industry problem not found");
    }

    await prisma.industryProblemTranslation.deleteMany({
      where: { problemId }
    });

    await prisma.industryProblem.delete({
      where: { problemId }
    });
  }

  /**
   * List solutions
   */
  static async listSolutions(industryId: number) {
    await this.ensureIndustry(industryId);

    const solutions = await prisma.industrySolution.findMany({
      where: { industryId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        }
      },
      orderBy: { displayOrder: "asc" }
    });

    return solutions.map(solution => ({
      solutionId: solution.solutionId,
      displayOrder: solution.displayOrder,
      isActive: solution.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(solution.translations))
    }));
  }

  /**
   * Create solution
   */
  static async createSolution(industryId: number, data: ProblemPayload) {
    await this.ensureIndustry(industryId);

    if (data.displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!data.translations || !data.translations[Locale.id]) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    const solution = await prisma.industrySolution.create({
      data: {
        industryId,
        displayOrder: data.displayOrder,
        isActive: data.isActive ?? true,
        translations: {
          create: this.buildTranslationPayload(data.translations)
        }
      },
      include: {
        translations: true
      }
    });

    return {
      solutionId: solution.solutionId,
      displayOrder: solution.displayOrder,
      isActive: solution.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(solution.translations))
    };
  }

  /**
   * Update solution
   */
  static async updateSolution(solutionId: number, data: UpdateProblemPayload) {
    const solution = await prisma.industrySolution.findUnique({
      where: { solutionId },
      include: {
        translations: true
      }
    });

    if (!solution) {
      throw new NotFoundError("Industry solution not found");
    }

    const updateData: any = {};
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (Object.keys(updateData).length > 0) {
      await prisma.industrySolution.update({
        where: { solutionId },
        data: updateData
      });
    }

    if (data.translations) {
      for (const locale of Object.values(Locale)) {
        const localeData = data.translations[locale];
        if (localeData) {
          await prisma.industrySolutionTranslation.upsert({
            where: {
              solutionId_locale: {
                solutionId,
                locale
              }
            },
            create: {
              solutionId,
              locale,
              title: localeData.title || null,
              description: localeData.description || null
            },
            update: {
              title: localeData.title || null,
              description: localeData.description || null
            }
          });
        }
      }
    }

    const updated = await prisma.industrySolution.findUnique({
      where: { solutionId },
      include: {
        translations: {
          orderBy: { locale: "asc" }
        }
      }
    });

    return {
      solutionId: updated!.solutionId,
      displayOrder: updated!.displayOrder,
      isActive: updated!.isActive,
      translations: mergeAllTranslations(this.normalizeTranslations(updated!.translations))
    };
  }

  /**
   * Delete solution
   */
  static async deleteSolution(solutionId: number) {
    const solution = await prisma.industrySolution.findUnique({
      where: { solutionId }
    });

    if (!solution) {
      throw new NotFoundError("Industry solution not found");
    }

    await prisma.industrySolutionTranslation.deleteMany({
      where: { solutionId }
    });

    await prisma.industrySolution.delete({
      where: { solutionId }
    });
  }

  /**
   * List media files for industry
   */
  static async listMedia(industryId: number) {
    await this.ensureIndustry(industryId);

    const media = await prisma.industryMedia.findMany({
      where: { industryId },
      orderBy: { displayOrder: "asc" },
      include: {
        mediaFile: {
          select: {
            fileId: true,
            filePath: true,
            fileName: true,
            altText: true
          }
        }
      }
    });

    return media.map(mediaItem => ({
      industryMediaId: mediaItem.industryMediaId,
      mediaType: mediaItem.mediaType,
      usage: mediaItem.usage,
      displayOrder: mediaItem.displayOrder,
      file: mediaItem.mediaFile
    }));
  }

  /**
   * Attach media to industry
   */
  static async addMedia(industryId: number, data: MediaPayload) {
    await this.ensureIndustry(industryId);

    const file = await prisma.mediaFile.findUnique({
      where: { fileId: data.fileId }
    });

    if (!file || file.deletedAt) {
      throw new NotFoundError("Media file not found");
    }

    const media = await prisma.industryMedia.create({
      data: {
        industryId,
        fileId: data.fileId,
        mediaType: data.mediaType || null,
        usage: data.usage || null,
        displayOrder: data.displayOrder ?? null
      },
      include: {
        mediaFile: {
          select: {
            fileId: true,
            filePath: true,
            fileName: true,
            altText: true
          }
        }
      }
    });

    return {
      industryMediaId: media.industryMediaId,
      mediaType: media.mediaType,
      usage: media.usage,
      displayOrder: media.displayOrder,
      file: media.mediaFile
    };
  }

  /**
   * Update media metadata
   */
  static async updateMedia(industryMediaId: number, data: UpdateMediaPayload) {
    const media = await prisma.industryMedia.findUnique({
      where: { industryMediaId },
      include: {
        mediaFile: {
          select: {
            fileId: true,
            filePath: true,
            fileName: true,
            altText: true
          }
        }
      }
    });

    if (!media) {
      throw new NotFoundError("Industry media not found");
    }

    const updateData: any = {};
    if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;
    if (data.usage !== undefined) updateData.usage = data.usage;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

    if (data.fileId && data.fileId !== media.fileId) {
      const file = await prisma.mediaFile.findUnique({
        where: { fileId: data.fileId }
      });

      if (!file || file.deletedAt) {
        throw new NotFoundError("Media file not found");
      }

      updateData.fileId = data.fileId;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.industryMedia.update({
        where: { industryMediaId },
        data: updateData
      });
    }

    const updated = await prisma.industryMedia.findUnique({
      where: { industryMediaId },
      include: {
        mediaFile: {
          select: {
            fileId: true,
            filePath: true,
            fileName: true,
            altText: true
          }
        }
      }
    });

    return {
      industryMediaId: updated!.industryMediaId,
      mediaType: updated!.mediaType,
      usage: updated!.usage,
      displayOrder: updated!.displayOrder,
      file: updated!.mediaFile
    };
  }

  /**
   * Remove media
   */
  static async deleteMedia(industryMediaId: number) {
    const media = await prisma.industryMedia.findUnique({
      where: { industryMediaId }
    });

    if (!media) {
      throw new NotFoundError("Industry media not found");
    }

    await prisma.industryMedia.delete({
      where: { industryMediaId }
    });
  }
}
