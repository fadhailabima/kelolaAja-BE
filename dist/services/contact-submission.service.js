"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSubmissionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContactSubmissionService {
    static async getAllSubmissions(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.assignedTo)
            where.assignedTo = filters.assignedTo;
        if (filters?.source)
            where.source = filters.source;
        const [submissions, total] = await Promise.all([
            prisma.contactSubmission.findMany({
                where,
                include: {
                    visitor: {
                        select: {
                            visitorId: true,
                            ipAddress: true,
                            countryCode: true,
                            city: true,
                            deviceType: true,
                            browser: true,
                        },
                    },
                    assignee: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.contactSubmission.count({ where }),
        ]);
        return {
            data: submissions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getSubmissionById(submissionId) {
        const submission = await prisma.contactSubmission.findUnique({
            where: { submissionId },
            include: {
                visitor: true,
                assignee: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        if (!submission || submission.deletedAt) {
            throw new Error('Contact submission not found');
        }
        return submission;
    }
    static async createSubmission(data) {
        const submission = await prisma.contactSubmission.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
                source: data.source || 'website',
                status: 'pending',
                visitorId: data.visitorId,
            },
        });
        return submission;
    }
    static async updateSubmission(submissionId, data) {
        const submission = await prisma.contactSubmission.findUnique({
            where: { submissionId },
        });
        if (!submission || submission.deletedAt) {
            throw new Error('Contact submission not found');
        }
        const updateData = {};
        if (data.status !== undefined) {
            updateData.status = data.status;
            if (data.status === 'contacted' && !submission.contactedAt) {
                updateData.contactedAt = new Date();
            }
            if (data.status === 'resolved' && !submission.resolvedAt) {
                updateData.resolvedAt = new Date();
            }
        }
        if (data.adminNotes !== undefined)
            updateData.adminNotes = data.adminNotes;
        if (data.assignedTo !== undefined)
            updateData.assignedTo = data.assignedTo;
        const updatedSubmission = await prisma.contactSubmission.update({
            where: { submissionId },
            data: updateData,
            include: {
                visitor: true,
                assignee: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return updatedSubmission;
    }
    static async assignSubmission(submissionId, assignedTo) {
        const submission = await prisma.contactSubmission.findUnique({
            where: { submissionId },
        });
        if (!submission || submission.deletedAt) {
            throw new Error('Contact submission not found');
        }
        const updatedSubmission = await prisma.contactSubmission.update({
            where: { submissionId },
            data: {
                assignedTo,
                status: submission.status === 'pending' ? 'assigned' : submission.status,
            },
            include: {
                assignee: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return updatedSubmission;
    }
    static async deleteSubmission(submissionId) {
        const submission = await prisma.contactSubmission.findUnique({
            where: { submissionId },
        });
        if (!submission || submission.deletedAt) {
            throw new Error('Contact submission not found');
        }
        await prisma.contactSubmission.update({
            where: { submissionId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Contact submission deleted successfully' };
    }
    static async getSubmissionStats() {
        const [totalSubmissions, byStatus, recentSubmissions] = await Promise.all([
            prisma.contactSubmission.count({
                where: { deletedAt: null },
            }),
            prisma.contactSubmission.groupBy({
                by: ['status'],
                where: { deletedAt: null },
                _count: {
                    submissionId: true,
                },
            }),
            prisma.contactSubmission.count({
                where: {
                    deletedAt: null,
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);
        return {
            totalSubmissions,
            byStatus: byStatus.map((item) => ({
                status: item.status || 'unknown',
                count: item._count.submissionId,
            })),
            recentSubmissions,
        };
    }
}
exports.ContactSubmissionService = ContactSubmissionService;
//# sourceMappingURL=contact-submission.service.js.map