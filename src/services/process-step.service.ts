import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import { Locale } from "@prisma/client";
import { mergeAllTranslations } from "../utils/translation";

export class ProcessStepService {
  /**
   * Get all active process steps (Public)
   */
  static async getPublicSteps(_locale: Locale) {
    const steps: any = await prisma.processStep.findMany({
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

    return steps.map((step: any) => ({
      stepId: step.stepId,
      displayOrder: step.displayOrder,
      translations: mergeAllTranslations(step.translations),
      image: step.imageFile
        ? {
            fileId: step.imageFile.fileId,
            filePath: step.imageFile.filePath,
            altText: step.imageFile.altText
          }
        : null
    }));
  }

  /**
   * Get all steps with all translations (Admin)
   */
  static async getAllSteps(page: number, limit: number, search?: string, isActive?: string) {
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

    const [total, steps]: any = await Promise.all([
      prisma.processStep.count({ where }),
      prisma.processStep.findMany({
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

    const result = steps.map((step: any) => ({
      stepId: step.stepId,
      displayOrder: step.displayOrder,
      imageFileId: step.imageFileId,
      isActive: step.isActive,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
      image: step.imageFile,
      creator: step.creator,
      updater: step.updater,
      translations: mergeAllTranslations(step.translations)
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
   * Create new process step
   */
  static async createStep(data: any, userId: number) {
    const { displayOrder, imageFileId, translations } = data;

    if (displayOrder === undefined) {
      throw new ValidationError("displayOrder is required");
    }

    if (!translations || !translations.id) {
      throw new ValidationError("Indonesian translation (id) is required");
    }

    // Generate stepCode
    const stepCode = `STEP_${Date.now()}`;

    // Verify image file if provided
    if (imageFileId) {
      const imageFile = await prisma.mediaFile.findUnique({
        where: { fileId: imageFileId }
      });

      if (!imageFile) {
        throw new NotFoundError("Image file not found");
      }
    }

    const step: any = await prisma.processStep.create({
      data: {
        stepCode,
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
      ...step,
      translations: mergeAllTranslations(step.translations)
    };
  }

  /**
   * Update process step
   */
  static async updateStep(stepId: number, data: any, userId: number) {
    const { displayOrder, imageFileId, isActive, translations } = data;

    const existing = await prisma.processStep.findUnique({
      where: { stepId }
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Process step not found");
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

    await prisma.processStep.update({
      where: { stepId },
      data: updateData
    });

    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.processStepTranslation.upsert({
            where: {
              stepId_locale: {
                stepId,
                locale
              }
            },
            create: {
              stepId,
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

    const updated: any = await prisma.processStep.findUnique({
      where: { stepId },
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
   * Soft delete process step
   */
  static async deleteStep(stepId: number, userId: number) {
    const step = await prisma.processStep.findUnique({
      where: { stepId }
    });

    if (!step || step.deletedAt) {
      throw new NotFoundError("Process step not found");
    }

    await prisma.processStep.update({
      where: { stepId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId
      }
    });
  }
}
