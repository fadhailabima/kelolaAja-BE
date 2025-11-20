"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenefitStatService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class BenefitStatService {
    static async getPublicStats(locale) {
        const stats = await prisma_1.prisma.benefitStat.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            include: {
                translations: {
                    where: { locale },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
        return stats.map((stat) => {
            const translation = stat.translations[0] || {};
            return {
                statId: stat.statId,
                value: stat.statValue,
                displayOrder: stat.displayOrder,
                label: translation.label || '',
            };
        });
    }
    static async getAllStats(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { statValue: { contains: search, mode: 'insensitive' } },
                { translations: { some: { label: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const [total, stats] = await Promise.all([
            prisma_1.prisma.benefitStat.count({ where }),
            prisma_1.prisma.benefitStat.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: 'asc' },
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
        const result = stats.map((stat) => ({
            statId: stat.statId,
            statValue: stat.statValue,
            displayOrder: stat.displayOrder,
            isActive: stat.isActive,
            createdAt: stat.createdAt,
            updatedAt: stat.updatedAt,
            creator: stat.creator,
            updater: stat.updater,
            translations: (0, translation_1.mergeAllTranslations)(stat.translations),
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
    static async createStat(data, userId) {
        const { statValue, displayOrder, translations } = data;
        if (!statValue || displayOrder === undefined) {
            throw new errors_1.ValidationError('statValue and displayOrder are required');
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError('Indonesian translation (id) is required');
        }
        const statCode = `STAT_${Date.now()}`;
        const stat = await prisma_1.prisma.benefitStat.create({
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
                            locale: client_1.Locale.id,
                            label: translations.id.label,
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    label: translations.en.label,
                                },
                            ]
                            : []),
                    ],
                },
            },
            include: {
                translations: true,
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
            ...stat,
            translations: (0, translation_1.mergeAllTranslations)(stat.translations),
        };
    }
    static async updateStat(statId, data, userId) {
        const { statValue, displayOrder, isActive, translations } = data;
        const existing = await prisma_1.prisma.benefitStat.findUnique({
            where: { statId },
        });
        if (!existing || existing.deletedAt) {
            throw new errors_1.NotFoundError('Benefit stat not found');
        }
        const updateData = { updatedBy: userId };
        if (statValue)
            updateData.statValue = statValue;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.benefitStat.update({
            where: { statId },
            data: updateData,
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.benefitStatTranslation.upsert({
                        where: {
                            statId_locale: {
                                statId,
                                locale,
                            },
                        },
                        create: {
                            statId,
                            locale,
                            label: translations[locale].label,
                        },
                        update: {
                            label: translations[locale].label,
                        },
                    });
                }
            }
        }
        const updated = await prisma_1.prisma.benefitStat.findUnique({
            where: { statId },
            include: {
                translations: true,
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
    static async deleteStat(statId, userId) {
        const stat = await prisma_1.prisma.benefitStat.findUnique({
            where: { statId },
        });
        if (!stat || stat.deletedAt) {
            throw new errors_1.NotFoundError('Benefit stat not found');
        }
        await prisma_1.prisma.benefitStat.update({
            where: { statId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId,
            },
        });
    }
}
exports.BenefitStatService = BenefitStatService;
//# sourceMappingURL=benefit-stat.service.js.map