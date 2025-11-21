"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class PartnerService {
    static async getPublicPartners(locale) {
        const partners = await prisma_1.prisma.partner.findMany({
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
        return partners.map((partner) => {
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
    static async getAllPartners(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { partnerName: { contains: search, mode: "insensitive" } },
                { translations: { some: { description: { contains: search, mode: "insensitive" } } } }
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const [total, partners] = await Promise.all([
            prisma_1.prisma.partner.count({ where }),
            prisma_1.prisma.partner.findMany({
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
        const result = partners.map((partner) => ({
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
            translations: (0, translation_1.mergeAllTranslations)(partner.translations)
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
    static async createPartner(data, userId) {
        const { partnerName, logoFileId, displayOrder, translations } = data;
        if (!partnerName || displayOrder === undefined) {
            throw new errors_1.ValidationError("partnerName and displayOrder are required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        if (logoFileId) {
            const logoFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: logoFileId }
            });
            if (!logoFile) {
                throw new errors_1.NotFoundError("Logo file not found");
            }
        }
        const partner = await prisma_1.prisma.partner.create({
            data: {
                partnerName,
                logoFileId: logoFileId || null,
                displayOrder,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            description: translations.id.description || null
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
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
            translations: (0, translation_1.mergeAllTranslations)(partner.translations)
        };
    }
    static async updatePartner(partnerId, data, userId) {
        const { partnerName, logoFileId, displayOrder, isActive, translations } = data;
        const existingPartner = await prisma_1.prisma.partner.findUnique({
            where: { partnerId }
        });
        if (!existingPartner || existingPartner.deletedAt) {
            throw new errors_1.NotFoundError("Partner not found");
        }
        if (logoFileId) {
            const logoFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: logoFileId }
            });
            if (!logoFile) {
                throw new errors_1.NotFoundError("Logo file not found");
            }
        }
        const updateData = {
            updatedBy: userId
        };
        if (partnerName)
            updateData.partnerName = partnerName;
        if (logoFileId !== undefined)
            updateData.logoFileId = logoFileId;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.partner.update({
            where: { partnerId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.partnerTranslation.upsert({
                        where: {
                            partnerId_locale: {
                                partnerId,
                                locale
                            }
                        },
                        create: {
                            partnerId,
                            locale,
                            description: translations[locale].description || null
                        },
                        update: {
                            description: translations[locale].description || null
                        }
                    });
                }
            }
        }
        const updatedPartner = await prisma_1.prisma.partner.findUnique({
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
            translations: (0, translation_1.mergeAllTranslations)(updatedPartner.translations)
        };
    }
    static async deletePartner(partnerId, userId) {
        const partner = await prisma_1.prisma.partner.findUnique({
            where: { partnerId }
        });
        if (!partner || partner.deletedAt) {
            throw new errors_1.NotFoundError("Partner not found");
        }
        await prisma_1.prisma.partner.update({
            where: { partnerId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.PartnerService = PartnerService;
//# sourceMappingURL=partner.service.js.map