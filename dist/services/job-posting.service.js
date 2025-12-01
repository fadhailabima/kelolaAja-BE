"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPostingService = void 0;
const prisma_1 = require("../utils/prisma");
class JobPostingService {
    async createJobPosting(data, createdBy) {
        const { translations, requirements, responsibilities, benefits, ...jobData } = data;
        const job = await prisma_1.prisma.jobPosting.create({
            data: {
                ...jobData,
                createdBy,
                updatedBy: createdBy,
                translations: {
                    create: translations,
                },
                requirements: requirements?.length
                    ? {
                        create: requirements.map((req) => ({
                            displayOrder: req.displayOrder,
                            isRequired: req.isRequired ?? true,
                            translations: {
                                create: {
                                    locale: req.locale,
                                    requirement: req.requirement,
                                },
                            },
                        })),
                    }
                    : undefined,
                responsibilities: responsibilities?.length
                    ? {
                        create: responsibilities.map((resp) => ({
                            displayOrder: resp.displayOrder,
                            translations: {
                                create: {
                                    locale: resp.locale,
                                    responsibility: resp.responsibility,
                                },
                            },
                        })),
                    }
                    : undefined,
                benefits: benefits?.length
                    ? {
                        create: benefits.map((ben) => ({
                            displayOrder: ben.displayOrder,
                            iconName: ben.iconName,
                            translations: {
                                create: {
                                    locale: ben.locale,
                                    benefit: ben.benefit,
                                    description: ben.description,
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                translations: true,
                requirements: {
                    include: { translations: true },
                },
                responsibilities: {
                    include: { translations: true },
                },
                benefits: {
                    include: { translations: true },
                },
            },
        });
        return job;
    }
    async updateJobPosting(jobId, data, updatedBy) {
        const { translations, requirements, responsibilities, benefits, ...jobData } = data;
        if (requirements !== undefined) {
            await prisma_1.prisma.jobRequirement.deleteMany({ where: { jobId } });
        }
        if (responsibilities !== undefined) {
            await prisma_1.prisma.jobResponsibility.deleteMany({ where: { jobId } });
        }
        if (benefits !== undefined) {
            await prisma_1.prisma.jobBenefit.deleteMany({ where: { jobId } });
        }
        if (translations !== undefined) {
            await prisma_1.prisma.jobPostingTranslation.deleteMany({ where: { jobId } });
        }
        const job = await prisma_1.prisma.jobPosting.update({
            where: { jobId },
            data: {
                ...jobData,
                updatedBy,
                translations: translations
                    ? {
                        deleteMany: {},
                        create: translations.map(t => ({
                            locale: t.locale,
                            title: t.title || '',
                            shortDescription: t.shortDescription,
                            description: t.description,
                            qualifications: t.qualifications,
                            additionalInfo: t.additionalInfo,
                        })),
                    }
                    : undefined,
                requirements: requirements?.length
                    ? {
                        create: requirements.map((req) => ({
                            displayOrder: req.displayOrder,
                            isRequired: req.isRequired ?? true,
                            translations: {
                                create: {
                                    locale: req.locale,
                                    requirement: req.requirement,
                                },
                            },
                        })),
                    }
                    : undefined,
                responsibilities: responsibilities?.length
                    ? {
                        create: responsibilities.map((resp) => ({
                            displayOrder: resp.displayOrder,
                            translations: {
                                create: {
                                    locale: resp.locale,
                                    responsibility: resp.responsibility,
                                },
                            },
                        })),
                    }
                    : undefined,
                benefits: benefits?.length
                    ? {
                        create: benefits.map((ben) => ({
                            displayOrder: ben.displayOrder,
                            iconName: ben.iconName,
                            translations: {
                                create: {
                                    locale: ben.locale,
                                    benefit: ben.benefit,
                                    description: ben.description,
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                translations: true,
                requirements: {
                    include: { translations: true },
                },
                responsibilities: {
                    include: { translations: true },
                },
                benefits: {
                    include: { translations: true },
                },
            },
        });
        return job;
    }
    async getJobPostings(filters, locale, page = 1, limit = 10) {
        const where = {
            deletedAt: null,
        };
        if (filters.jobType)
            where.jobType = filters.jobType;
        if (filters.jobLevel)
            where.jobLevel = filters.jobLevel;
        if (filters.workLocation)
            where.workLocation = filters.workLocation;
        if (filters.city)
            where.city = { contains: filters.city, mode: "insensitive" };
        if (filters.department)
            where.department = { contains: filters.department, mode: "insensitive" };
        if (filters.isActive !== undefined)
            where.isActive = filters.isActive;
        if (filters.isFeatured !== undefined)
            where.isFeatured = filters.isFeatured;
        if (filters.search) {
            where.OR = [
                { translations: { some: { title: { contains: filters.search, mode: "insensitive" } } } },
                { translations: { some: { description: { contains: filters.search, mode: "insensitive" } } } },
                { department: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const [total, jobs] = await Promise.all([
            prisma_1.prisma.jobPosting.count({ where }),
            prisma_1.prisma.jobPosting.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [
                    { isFeatured: "desc" },
                    { publishedAt: "desc" },
                    { createdAt: "desc" },
                ],
                include: {
                    translations: locale ? { where: { locale } } : true,
                    requirements: {
                        include: {
                            translations: locale ? { where: { locale } } : true,
                        },
                        orderBy: { displayOrder: "asc" },
                    },
                    responsibilities: {
                        include: {
                            translations: locale ? { where: { locale } } : true,
                        },
                        orderBy: { displayOrder: "asc" },
                    },
                    benefits: {
                        include: {
                            translations: locale ? { where: { locale } } : true,
                        },
                        orderBy: { displayOrder: "asc" },
                    },
                },
            }),
        ]);
        return {
            data: jobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getJobPostingById(jobId, locale) {
        const job = await prisma_1.prisma.jobPosting.findUnique({
            where: { jobId },
            include: {
                translations: locale ? { where: { locale } } : true,
                requirements: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
                responsibilities: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
                benefits: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
        return job;
    }
    async getJobPostingBySlug(slug, locale) {
        const job = await prisma_1.prisma.jobPosting.findUnique({
            where: { slug },
            include: {
                translations: locale ? { where: { locale } } : true,
                requirements: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
                responsibilities: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
                benefits: {
                    include: {
                        translations: locale ? { where: { locale } } : true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
        if (job) {
            await prisma_1.prisma.jobPosting.update({
                where: { jobId: job.jobId },
                data: { viewCount: { increment: 1 } },
            });
        }
        return job;
    }
    async deleteJobPosting(jobId) {
        return await prisma_1.prisma.jobPosting.update({
            where: { jobId },
            data: { deletedAt: new Date() },
        });
    }
    async getJobStats() {
        const [totalJobs, activeJobs, totalApplications, pendingApplications] = await Promise.all([
            prisma_1.prisma.jobPosting.count({ where: { deletedAt: null } }),
            prisma_1.prisma.jobPosting.count({ where: { isActive: true, deletedAt: null } }),
            prisma_1.prisma.jobApplication.count({ where: { deletedAt: null } }),
            prisma_1.prisma.jobApplication.count({ where: { status: "Pending", deletedAt: null } }),
        ]);
        const jobsByType = await prisma_1.prisma.jobPosting.groupBy({
            by: ["jobType"],
            where: { deletedAt: null },
            _count: true,
        });
        const jobsByLevel = await prisma_1.prisma.jobPosting.groupBy({
            by: ["jobLevel"],
            where: { deletedAt: null },
            _count: true,
        });
        return {
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            jobsByType,
            jobsByLevel,
        };
    }
}
exports.JobPostingService = JobPostingService;
//# sourceMappingURL=job-posting.service.js.map