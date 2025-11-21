"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuditLogService {
    static async createLog(data) {
        const log = await prisma.auditLog.create({
            data: {
                userId: data.userId,
                actionType: data.actionType,
                entityType: data.entityType,
                entityId: data.entityId,
                oldValues: data.oldValues,
                newValues: data.newValues,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return log;
    }
    static async getAllLogs(page = 1, limit = 50, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.userId)
            where.userId = filters.userId;
        if (filters?.actionType)
            where.actionType = filters.actionType;
        if (filters?.entityType)
            where.entityType = filters.entityType;
        if (filters?.entityId)
            where.entityId = filters.entityId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: {
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
            prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getEntityLogs(entityType, entityId) {
        const logs = await prisma.auditLog.findMany({
            where: {
                entityType,
                entityId,
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return logs;
    }
    static async getUserLogs(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where: { userId },
                include: {
                    user: {
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
            prisma.auditLog.count({ where: { userId } }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getLogStats() {
        const [totalLogs, byActionType, byEntityType, recentActivity] = await Promise.all([
            prisma.auditLog.count(),
            prisma.auditLog.groupBy({
                by: ['actionType'],
                _count: {
                    logId: true,
                },
            }),
            prisma.auditLog.groupBy({
                by: ['entityType'],
                _count: {
                    logId: true,
                },
            }),
            prisma.auditLog.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);
        return {
            totalLogs,
            byActionType: byActionType.map((item) => ({
                actionType: item.actionType,
                count: item._count.logId,
            })),
            byEntityType: byEntityType.map((item) => ({
                entityType: item.entityType,
                count: item._count.logId,
            })),
            recentActivity,
        };
    }
    static async logCRUD(userId, action, entityType, entityId, oldValues, newValues, request) {
        return this.createLog({
            userId,
            actionType: action,
            entityType,
            entityId,
            oldValues,
            newValues,
            ipAddress: request?.ip,
            userAgent: request?.userAgent,
        });
    }
}
exports.AuditLogService = AuditLogService;
//# sourceMappingURL=audit-log.service.js.map