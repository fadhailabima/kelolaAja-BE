"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationService = void 0;
const prisma_1 = require("../utils/prisma");
class JobApplicationService {
    async createJobApplication(data, ipAddress, userAgent) {
        const application = await prisma_1.prisma.jobApplication.create({
            data: {
                ...data,
                ipAddress,
                userAgent
            },
            include: {
                job: {
                    include: {
                        translations: true
                    }
                },
                cvFile: true
            }
        });
        await prisma_1.prisma.jobPosting.update({
            where: { jobId: data.jobId },
            data: { applicationCount: { increment: 1 } }
        });
        return application;
    }
    async updateJobApplication(applicationId, data) {
        const updateData = { ...data };
        if (data.status) {
            if (data.status === "Reviewed" && !updateData.reviewedAt) {
                updateData.reviewedAt = new Date();
            }
            if (data.status === "Interview" && !updateData.interviewedAt) {
                updateData.interviewedAt = new Date();
            }
        }
        return await prisma_1.prisma.jobApplication.update({
            where: { applicationId },
            data: updateData,
            include: {
                job: {
                    include: {
                        translations: true
                    }
                },
                cvFile: true
            }
        });
    }
    async getJobApplications(filters, page = 1, limit = 10) {
        const where = {
            deletedAt: null
        };
        if (filters.jobId)
            where.jobId = filters.jobId;
        if (filters.status)
            where.status = filters.status;
        if (filters.ratingMin)
            where.rating = { gte: filters.ratingMin };
        if (filters.search) {
            where.OR = [
                { applicantName: { contains: filters.search, mode: "insensitive" } },
                { applicantEmail: { contains: filters.search, mode: "insensitive" } },
                { currentCompany: { contains: filters.search, mode: "insensitive" } },
                { currentPosition: { contains: filters.search, mode: "insensitive" } }
            ];
        }
        const [total, applications] = await Promise.all([
            prisma_1.prisma.jobApplication.count({ where }),
            prisma_1.prisma.jobApplication.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    job: {
                        include: {
                            translations: true
                        }
                    },
                    cvFile: true
                }
            })
        ]);
        return {
            data: applications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getJobApplicationById(applicationId) {
        return await prisma_1.prisma.jobApplication.findUnique({
            where: { applicationId },
            include: {
                job: {
                    include: {
                        translations: true
                    }
                },
                cvFile: true
            }
        });
    }
    async getApplicationsByJob(jobId, page = 1, limit = 10) {
        return this.getJobApplications({ jobId }, page, limit);
    }
    async deleteJobApplication(applicationId) {
        const application = await prisma_1.prisma.jobApplication.findUnique({
            where: { applicationId },
            select: { jobId: true }
        });
        if (application) {
            await prisma_1.prisma.jobPosting.update({
                where: { jobId: application.jobId },
                data: { applicationCount: { decrement: 1 } }
            });
        }
        return await prisma_1.prisma.jobApplication.update({
            where: { applicationId },
            data: { deletedAt: new Date() }
        });
    }
    async getApplicationStats(jobId) {
        const where = { deletedAt: null };
        if (jobId)
            where.jobId = jobId;
        const [total, byStatus] = await Promise.all([
            prisma_1.prisma.jobApplication.count({ where }),
            prisma_1.prisma.jobApplication.groupBy({
                by: ["status"],
                where,
                _count: true
            })
        ]);
        const avgRating = await prisma_1.prisma.jobApplication.aggregate({
            where: { ...where, rating: { not: null } },
            _avg: { rating: true }
        });
        return {
            total,
            byStatus,
            avgRating: avgRating._avg.rating
        };
    }
}
exports.JobApplicationService = JobApplicationService;
//# sourceMappingURL=job-application.service.js.map