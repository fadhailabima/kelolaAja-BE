"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreValueService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class CoreValueService {
    static async getPublicValues(locale) {
        const values = await prisma_1.prisma.coreValue.findMany({
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
        return values.map((value) => {
            const translation = value.translations[0] || {};
            return {
                valueId: value.valueId,
                displayOrder: value.displayOrder,
                iconName: value.iconName,
                title: translation.title || "",
                description: translation.description || "",
                image: value.imageFile
                    ? {
                        fileId: value.imageFile.fileId,
                        filePath: value.imageFile.filePath,
                        altText: value.imageFile.altText
                    }
                    : null
            };
        });
    }
    static async getAllValues(page, limit, search, isActive) {
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
        const [total, values] = await Promise.all([
            prisma_1.prisma.coreValue.count({ where }),
            prisma_1.prisma.coreValue.findMany({
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
        const result = values.map((value) => ({
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
            translations: (0, translation_1.mergeAllTranslations)(value.translations)
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
    static async createValue(data, userId) {
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
        const valueCode = `CORE_VALUE_${Date.now()}`;
        const value = await prisma_1.prisma.coreValue.create({
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
            ...value,
            translations: (0, translation_1.mergeAllTranslations)(value.translations)
        };
    }
    static async updateValue(valueId, data, userId) {
        const { displayOrder, iconName, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.coreValue.findUnique({
            where: { valueId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("Core value not found");
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
        await prisma_1.prisma.coreValue.update({
            where: { valueId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.coreValueTranslation.upsert({
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
        const updated = await prisma_1.prisma.coreValue.findUnique({
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
            translations: (0, translation_1.mergeAllTranslations)(updated.translations)
        };
    }
    static async deleteValue(valueId, userId) {
        const value = await prisma_1.prisma.coreValue.findUnique({
            where: { valueId }
        });
        if (!value || value.deletedAt) {
            throw new errors_1.NotFoundError("Core value not found");
        }
        await prisma_1.prisma.coreValue.update({
            where: { valueId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.CoreValueService = CoreValueService;
//# sourceMappingURL=core-value.service.js.map