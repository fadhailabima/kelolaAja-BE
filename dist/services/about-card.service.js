"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCardService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class AboutCardService {
    static async getPublicCards(locale) {
        const cards = await prisma_1.prisma.aboutCard.findMany({
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
        return cards.map((card) => {
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
    static async getAllCards(page, limit, search, isActive) {
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
        const [total, cards] = await Promise.all([
            prisma_1.prisma.aboutCard.count({ where }),
            prisma_1.prisma.aboutCard.findMany({
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
        const result = cards.map((card) => ({
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
            translations: (0, translation_1.mergeAllTranslations)(card.translations)
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
    static async createCard(data, userId) {
        const { displayOrder, cardLink, imageFileId, translations } = data;
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
        const cardCode = `ABOUT_${Date.now()}`;
        const card = await prisma_1.prisma.aboutCard.create({
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
            ...card,
            translations: (0, translation_1.mergeAllTranslations)(card.translations)
        };
    }
    static async updateCard(cardId, data, userId) {
        const { displayOrder, cardLink, imageFileId, isActive, translations } = data;
        const existing = await prisma_1.prisma.aboutCard.findUnique({
            where: { cardId }
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError("About card not found");
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
        if (cardLink !== undefined)
            updateData.cardLink = cardLink;
        if (imageFileId !== undefined)
            updateData.imageFileId = imageFileId;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.aboutCard.update({
            where: { cardId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.aboutCardTranslation.upsert({
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
        const updated = await prisma_1.prisma.aboutCard.findUnique({
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
            translations: (0, translation_1.mergeAllTranslations)(updated.translations)
        };
    }
    static async deleteCard(cardId, userId) {
        const card = await prisma_1.prisma.aboutCard.findUnique({
            where: { cardId }
        });
        if (!card || card.deletedAt) {
            throw new errors_1.NotFoundError("About card not found");
        }
        await prisma_1.prisma.aboutCard.update({
            where: { cardId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.AboutCardService = AboutCardService;
//# sourceMappingURL=about-card.service.js.map