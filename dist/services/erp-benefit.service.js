"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERPBenefitService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class ERPBenefitService {
    static async getPublicBenefits(locale) {
        const benefits = await prisma_1.prisma.eRPBenefit.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true,
                    },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return benefits.map((benefit) => {
            const translation = benefit.translations[0] || {};
            return {
                benefitId: benefit.benefitId,
                displayOrder: benefit.displayOrder,
                title: translation.title || '',
                description: translation.description || '',
                image: benefit.imageFile
                    ? {
                        fileId: benefit.imageFile.fileId,
                        filePath: benefit.imageFile.filePath,
                        altText: benefit.imageFile.altText,
                    }
                    : null,
            };
        });
    }
    static async getAllBenefits(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.translations = {
                some: {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                },
            };
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const [total, benefits] = await Promise.all([
            prisma_1.prisma.eRPBenefit.count({ where }),
            prisma_1.prisma.eRPBenefit.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: 'asc' },
                    },
                    imageFile: {
                        select: {
                            fileId: true,
                            filePath: true,
                            altText: true,
                        },
                    },
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                    updater: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
                orderBy: { displayOrder: 'asc' },
                skip,
                take: limit,
            }),
        ]);
        const result = benefits.map((benefit) => ({
            benefitId: benefit.benefitId,
            displayOrder: benefit.displayOrder,
            imageFileId: benefit.imageFileId,
            isActive: benefit.isActive,
            createdAt: benefit.createdAt,
            updatedAt: benefit.updatedAt,
            image: benefit.imageFile,
            creator: benefit.creator,
            updater: benefit.updater,
            translations: (0, translation_1.mergeAllTranslations)(benefit.translations),
        }));
        return {
            data: result,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async createBenefit(data, userId) {
        const { displayOrder, imageFileId, translations } = data;
        if (displayOrder === undefined) {
            throw new errors_1.ValidationError('displayOrder is required');
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError('Indonesian translation (id) is required');
        }
        const benefitCode = `BENEFIT_${Date.now()}`;
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId },
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError('Image file not found');
            }
        }
        const benefit = await prisma_1.prisma.eRPBenefit.create({
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
                            locale: client_1.Locale.id,
                            title: translations.id.title,
                            description: translations.id.description || null,
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    title: translations.en.title,
                                    description: translations.en.description || null,
                                },
                            ]
                            : []),
                    ],
                },
            },
            include: {
                translations: true,
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true,
                    },
                },
                creator: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return {
            ...benefit,
            translations: (0, translation_1.mergeAllTranslations)(benefit.translations),
        };
    }
    static async updateBenefit(benefitId, data, userId) {
        const { displayOrder, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.eRPBenefit.findUnique({
            where: { benefitId },
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError('ERP benefit not found');
        }
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId },
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError('Image file not found');
            }
        }
        const updateData = { updatedBy: userId };
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (imageFileId !== undefined)
            updateData.imageFileId = imageFileId;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.eRPBenefit.update({
            where: { benefitId },
            data: updateData,
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.eRPBenefitTranslation.upsert({
                        where: {
                            benefitId_locale: {
                                benefitId,
                                locale,
                            },
                        },
                        create: {
                            benefitId,
                            locale,
                            title: translations[locale].title,
                            description: translations[locale].description || null,
                        },
                        update: {
                            title: translations[locale].title,
                            description: translations[locale].description || null,
                        },
                    });
                }
            }
        }
        const updated = await prisma_1.prisma.eRPBenefit.findUnique({
            where: { benefitId },
            include: {
                translations: true,
                imageFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true,
                    },
                },
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return {
            ...updated,
            translations: (0, translation_1.mergeAllTranslations)(updated.translations),
        };
    }
    static async deleteBenefit(benefitId, userId) {
        const benefit = await prisma_1.prisma.eRPBenefit.findUnique({
            where: { benefitId },
        });
        if (!benefit || benefit.deletedAt) {
            throw new errors_1.NotFoundError('ERP benefit not found');
        }
        await prisma_1.prisma.eRPBenefit.update({
            where: { benefitId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId,
            },
        });
    }
}
exports.ERPBenefitService = ERPBenefitService;
//# sourceMappingURL=erp-benefit.service.js.map