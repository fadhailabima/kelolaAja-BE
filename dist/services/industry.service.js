"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustryService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const translation_1 = require("../utils/translation");
class IndustryService {
    static async ensureIndustry(industryId) {
        const industry = await prisma_1.prisma.industry.findUnique({
            where: { industryId }
        });
        if (!industry || industry.deletedAt) {
            throw new errors_1.NotFoundError("Industry not found");
        }
        return industry;
    }
    static normalizeTranslations(translations) {
        if (!translations) {
            return [];
        }
        return translations.map(translation => ({
            ...translation,
            locale: translation.locale || client_1.Locale.id
        }));
    }
    static formatContentPublic(item, locale) {
        const translation = (0, translation_1.extractTranslation)(this.normalizeTranslations(item.translations), locale) || {};
        return {
            id: item.problemId ?? item.solutionId,
            displayOrder: item.displayOrder,
            title: translation.title || "",
            description: translation.description || ""
        };
    }
    static formatIndustryPublic(industry, locale) {
        const translation = (0, translation_1.extractTranslation)(this.normalizeTranslations(industry.translations), locale) || {};
        return {
            industryId: industry.industryId,
            industryCode: industry.industryCode,
            slug: industry.slug,
            displayOrder: industry.displayOrder,
            title: translation?.title || "",
            description: translation?.description || "",
            introText: translation?.introText || "",
            problems: (industry.problems || []).map((problem) => this.formatContentPublic(problem, locale)),
            solutions: (industry.solutions || []).map((solution) => this.formatContentPublic(solution, locale)),
            media: (industry.media || []).map((mediaItem) => ({
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
    static buildIndustryTranslationPayload(translations) {
        const payload = [];
        for (const locale of Object.values(client_1.Locale)) {
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
    static buildTranslationPayload(translations) {
        const payload = [];
        for (const locale of Object.values(client_1.Locale)) {
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
    static async getPublicIndustries(locale) {
        const industries = await prisma_1.prisma.industry.findMany({
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
    static async getPublicIndustryBySlug(slug, locale) {
        const industry = await prisma_1.prisma.industry.findFirst({
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
            throw new errors_1.NotFoundError("Industry not found");
        }
        return this.formatIndustryPublic(industry, locale);
    }
    static async getIndustries(page, limit, search, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
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
            prisma_1.prisma.industry.count({ where }),
            prisma_1.prisma.industry.findMany({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(industry.translations)),
            problems: industry.problems.map(problem => ({
                problemId: problem.problemId,
                displayOrder: problem.displayOrder,
                isActive: problem.isActive,
                translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(problem.translations))
            })),
            solutions: industry.solutions.map(solution => ({
                solutionId: solution.solutionId,
                displayOrder: solution.displayOrder,
                isActive: solution.isActive,
                translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(solution.translations))
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
    static async getIndustryDetail(industryId) {
        const industry = await prisma_1.prisma.industry.findUnique({
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
            throw new errors_1.NotFoundError("Industry not found");
        }
        return {
            industryId: industry.industryId,
            industryCode: industry.industryCode,
            slug: industry.slug,
            displayOrder: industry.displayOrder,
            isActive: industry.isActive,
            createdAt: industry.createdAt,
            updatedAt: industry.updatedAt,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(industry.translations)),
            problems: industry.problems.map(problem => ({
                problemId: problem.problemId,
                displayOrder: problem.displayOrder,
                isActive: problem.isActive,
                translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(problem.translations))
            })),
            solutions: industry.solutions.map(solution => ({
                solutionId: solution.solutionId,
                displayOrder: solution.displayOrder,
                isActive: solution.isActive,
                translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(solution.translations))
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
    static async createIndustry(data, userId) {
        if (!data.industryCode || !data.slug || data.displayOrder === undefined) {
            throw new errors_1.ValidationError("industryCode, slug, and displayOrder are required");
        }
        if (!data.translations || !data.translations[client_1.Locale.id]) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const existing = await prisma_1.prisma.industry.findFirst({
            where: {
                OR: [{ industryCode: data.industryCode }, { slug: data.slug }]
            }
        });
        if (existing) {
            throw new errors_1.ValidationError("Industry code or slug already exists");
        }
        const industry = await prisma_1.prisma.industry.create({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(industry.translations))
        };
    }
    static async updateIndustry(industryId, data, userId) {
        const industry = await this.ensureIndustry(industryId);
        const updateData = {
            updatedBy: userId
        };
        if (data.industryCode && data.industryCode !== industry.industryCode) {
            const duplicateCode = await prisma_1.prisma.industry.findFirst({
                where: {
                    industryCode: data.industryCode,
                    industryId: { not: industryId }
                }
            });
            if (duplicateCode) {
                throw new errors_1.ValidationError("Industry code already exists");
            }
            updateData.industryCode = data.industryCode;
        }
        if (data.slug && data.slug !== industry.slug) {
            const duplicateSlug = await prisma_1.prisma.industry.findFirst({
                where: {
                    slug: data.slug,
                    industryId: { not: industryId }
                }
            });
            if (duplicateSlug) {
                throw new errors_1.ValidationError("Slug already exists");
            }
            updateData.slug = data.slug;
        }
        if (data.displayOrder !== undefined) {
            updateData.displayOrder = data.displayOrder;
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }
        await prisma_1.prisma.industry.update({
            where: { industryId },
            data: updateData
        });
        if (data.translations) {
            for (const locale of Object.values(client_1.Locale)) {
                const localeData = data.translations[locale];
                if (localeData) {
                    await prisma_1.prisma.industryTranslation.upsert({
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
    static async deleteIndustry(industryId, userId) {
        await this.ensureIndustry(industryId);
        await prisma_1.prisma.industry.update({
            where: { industryId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
    static async listProblems(industryId) {
        await this.ensureIndustry(industryId);
        const problems = await prisma_1.prisma.industryProblem.findMany({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(problem.translations))
        }));
    }
    static async createProblem(industryId, data) {
        await this.ensureIndustry(industryId);
        if (data.displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!data.translations || !data.translations[client_1.Locale.id]) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const problem = await prisma_1.prisma.industryProblem.create({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(problem.translations))
        };
    }
    static async updateProblem(problemId, data) {
        const problem = await prisma_1.prisma.industryProblem.findUnique({
            where: { problemId },
            include: {
                translations: true
            }
        });
        if (!problem) {
            throw new errors_1.NotFoundError("Industry problem not found");
        }
        const updateData = {};
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (Object.keys(updateData).length > 0) {
            await prisma_1.prisma.industryProblem.update({
                where: { problemId },
                data: updateData
            });
        }
        if (data.translations) {
            for (const locale of Object.values(client_1.Locale)) {
                const localeData = data.translations[locale];
                if (localeData) {
                    await prisma_1.prisma.industryProblemTranslation.upsert({
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
        const updated = await prisma_1.prisma.industryProblem.findUnique({
            where: { problemId },
            include: {
                translations: {
                    orderBy: { locale: "asc" }
                }
            }
        });
        return {
            problemId: updated.problemId,
            displayOrder: updated.displayOrder,
            isActive: updated.isActive,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(updated.translations))
        };
    }
    static async deleteProblem(problemId) {
        const problem = await prisma_1.prisma.industryProblem.findUnique({
            where: { problemId }
        });
        if (!problem) {
            throw new errors_1.NotFoundError("Industry problem not found");
        }
        await prisma_1.prisma.industryProblemTranslation.deleteMany({
            where: { problemId }
        });
        await prisma_1.prisma.industryProblem.delete({
            where: { problemId }
        });
    }
    static async listSolutions(industryId) {
        await this.ensureIndustry(industryId);
        const solutions = await prisma_1.prisma.industrySolution.findMany({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(solution.translations))
        }));
    }
    static async createSolution(industryId, data) {
        await this.ensureIndustry(industryId);
        if (data.displayOrder === undefined) {
            throw new errors_1.ValidationError("displayOrder is required");
        }
        if (!data.translations || !data.translations[client_1.Locale.id]) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        const solution = await prisma_1.prisma.industrySolution.create({
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
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(solution.translations))
        };
    }
    static async updateSolution(solutionId, data) {
        const solution = await prisma_1.prisma.industrySolution.findUnique({
            where: { solutionId },
            include: {
                translations: true
            }
        });
        if (!solution) {
            throw new errors_1.NotFoundError("Industry solution not found");
        }
        const updateData = {};
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (Object.keys(updateData).length > 0) {
            await prisma_1.prisma.industrySolution.update({
                where: { solutionId },
                data: updateData
            });
        }
        if (data.translations) {
            for (const locale of Object.values(client_1.Locale)) {
                const localeData = data.translations[locale];
                if (localeData) {
                    await prisma_1.prisma.industrySolutionTranslation.upsert({
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
        const updated = await prisma_1.prisma.industrySolution.findUnique({
            where: { solutionId },
            include: {
                translations: {
                    orderBy: { locale: "asc" }
                }
            }
        });
        return {
            solutionId: updated.solutionId,
            displayOrder: updated.displayOrder,
            isActive: updated.isActive,
            translations: (0, translation_1.mergeAllTranslations)(this.normalizeTranslations(updated.translations))
        };
    }
    static async deleteSolution(solutionId) {
        const solution = await prisma_1.prisma.industrySolution.findUnique({
            where: { solutionId }
        });
        if (!solution) {
            throw new errors_1.NotFoundError("Industry solution not found");
        }
        await prisma_1.prisma.industrySolutionTranslation.deleteMany({
            where: { solutionId }
        });
        await prisma_1.prisma.industrySolution.delete({
            where: { solutionId }
        });
    }
    static async listMedia(industryId) {
        await this.ensureIndustry(industryId);
        const media = await prisma_1.prisma.industryMedia.findMany({
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
    static async addMedia(industryId, data) {
        await this.ensureIndustry(industryId);
        const file = await prisma_1.prisma.mediaFile.findUnique({
            where: { fileId: data.fileId }
        });
        if (!file || file.deletedAt) {
            throw new errors_1.NotFoundError("Media file not found");
        }
        const media = await prisma_1.prisma.industryMedia.create({
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
    static async updateMedia(industryMediaId, data) {
        const media = await prisma_1.prisma.industryMedia.findUnique({
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
            throw new errors_1.NotFoundError("Industry media not found");
        }
        const updateData = {};
        if (data.mediaType !== undefined)
            updateData.mediaType = data.mediaType;
        if (data.usage !== undefined)
            updateData.usage = data.usage;
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.fileId && data.fileId !== media.fileId) {
            const file = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: data.fileId }
            });
            if (!file || file.deletedAt) {
                throw new errors_1.NotFoundError("Media file not found");
            }
            updateData.fileId = data.fileId;
        }
        if (Object.keys(updateData).length > 0) {
            await prisma_1.prisma.industryMedia.update({
                where: { industryMediaId },
                data: updateData
            });
        }
        const updated = await prisma_1.prisma.industryMedia.findUnique({
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
            industryMediaId: updated.industryMediaId,
            mediaType: updated.mediaType,
            usage: updated.usage,
            displayOrder: updated.displayOrder,
            file: updated.mediaFile
        };
    }
    static async deleteMedia(industryMediaId) {
        const media = await prisma_1.prisma.industryMedia.findUnique({
            where: { industryMediaId }
        });
        if (!media) {
            throw new errors_1.NotFoundError("Industry media not found");
        }
        await prisma_1.prisma.industryMedia.delete({
            where: { industryMediaId }
        });
    }
}
exports.IndustryService = IndustryService;
//# sourceMappingURL=industry.service.js.map