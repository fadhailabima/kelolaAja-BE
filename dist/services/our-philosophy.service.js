"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurPhilosophyService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class OurPhilosophyService {
    static async getPublicPhilosophies(locale) {
        const philosophies = await prisma_1.prisma.ourPhilosophy.findMany({
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
        return philosophies.map((philosophy) => {
            const translation = philosophy.translations[0] || {};
            return {
                philosophyId: philosophy.philosophyId,
                displayOrder: philosophy.displayOrder,
                iconName: philosophy.iconName,
                title: translation.title || "",
                description: translation.description || "",
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
    static async getAllPhilosophies(page, limit, search, isActive) {
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
        const [total, philosophies] = await Promise.all([
            prisma_1.prisma.ourPhilosophy.count({ where }),
            prisma_1.prisma.ourPhilosophy.findMany({
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
        const result = philosophies.map((philosophy) => ({
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
            translations: (0, translation_1.mergeAllTranslations)(philosophy.translations)
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
    static async createPhilosophy(data, userId) {
        const { displayOrder, iconName, imageFileId, translations } = data;
        if (displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        if (imageFileId) {
            const imageFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: imageFileId }
            });
            if (!imageFile) {
                throw new errors_1.NotFoundError("Image file not found");
            }
        }
        const philosophyCode = `PHILOSOPHY_${Date.now()}`;
        const philosophy = await prisma_1.prisma.ourPhilosophy.create({
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
            ...philosophy,
            translations: (0, translation_1.mergeAllTranslations)(philosophy.translations)
        };
    }
    static async updatePhilosophy(philosophyId, data, userId) {
        const { displayOrder, iconName, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.ourPhilosophy.findUnique({
            where: { philosophyId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("Philosophy not found");
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
        if (iconName !== undefined)
            updateData.iconName = iconName;
        if (imageFileId !== undefined)
            updateData.imageFileId = imageFileId;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.ourPhilosophy.update({
            where: { philosophyId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.ourPhilosophyTranslation.upsert({
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
        const updated = await prisma_1.prisma.ourPhilosophy.findUnique({
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
            translations: (0, translation_1.mergeAllTranslations)(updated.translations)
        };
    }
    static async deletePhilosophy(philosophyId, userId) {
        const philosophy = await prisma_1.prisma.ourPhilosophy.findUnique({
            where: { philosophyId }
        });
        if (!philosophy || philosophy.deletedAt) {
            throw new errors_1.NotFoundError("Philosophy not found");
        }
        await prisma_1.prisma.ourPhilosophy.update({
            where: { philosophyId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.OurPhilosophyService = OurPhilosophyService;
//# sourceMappingURL=our-philosophy.service.js.map