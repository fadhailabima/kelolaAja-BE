"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStepService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class ProcessStepService {
    static async getPublicSteps(locale) {
        const steps = await prisma_1.prisma.processStep.findMany({
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
        return steps.map((step) => {
            const translation = step.translations[0] || {};
            return {
                stepId: step.stepId,
                displayOrder: step.displayOrder,
                title: translation.title || "",
                description: translation.description || "",
                image: step.imageFile
                    ? {
                        fileId: step.imageFile.fileId,
                        filePath: step.imageFile.filePath,
                        altText: step.imageFile.altText
                    }
                    : null
            };
        });
    }
    static async getAllSteps(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
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
        const [total, steps] = await Promise.all([
            prisma_1.prisma.processStep.count({ where }),
            prisma_1.prisma.processStep.findMany({
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
        const result = steps.map((step) => ({
            stepId: step.stepId,
            displayOrder: step.displayOrder,
            imageFileId: step.imageFileId,
            isActive: step.isActive,
            createdAt: step.createdAt,
            updatedAt: step.updatedAt,
            image: step.imageFile,
            creator: step.creator,
            updater: step.updater,
            translations: (0, translation_1.mergeAllTranslations)(step.translations)
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
    static async createStep(data, userId) {
        const { displayOrder, imageFileId, translations } = data;
        if (displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const stepCode = `STEP_${Date.now()}`;
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId }
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError("Image file not found");
            }
        }
        const step = await prisma_1.prisma.processStep.create({
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
                            locale: client_1.Locale.id,
                            title: translations.id.title,
                            description: translations.id.description || null
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
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
            translations: (0, translation_1.mergeAllTranslations)(step.translations)
        };
    }
    static async updateStep(stepId, data, userId) {
        const { displayOrder, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.processStep.findUnique({
            where: { stepId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("Process step not found");
        }
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId }
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError("Image file not found");
            }
        }
        const updateData = { updatedBy: userId };
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (imageFileId !== undefined)
            updateData.imageFileId = imageFileId;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.processStep.update({
            where: { stepId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.processStepTranslation.upsert({
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
        const updated = await prisma_1.prisma.processStep.findUnique({
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
            translations: (0, translation_1.mergeAllTranslations)(updated.translations)
        };
    }
    static async deleteStep(stepId, userId) {
        const step = await prisma_1.prisma.processStep.findUnique({
            where: { stepId }
        });
        if (!step || step.deletedAt) {
            throw new errors_1.NotFoundError("Process step not found");
        }
        await prisma_1.prisma.processStep.update({
            where: { stepId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.ProcessStepService = ProcessStepService;
//# sourceMappingURL=process-step.service.js.map