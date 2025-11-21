import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditLogService {
  /**
   * Create a new audit log entry
   */
  static async createLog(data: {
    userId: number;
    actionType: string;
    entityType: string;
    entityId?: number;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
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

  /**
   * Get all audit logs (with pagination and filtering)
   */
  static async getAllLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: number;
      actionType?: string;
      entityType?: string;
      entityId?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.actionType) where.actionType = filters.actionType;
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.entityId) where.entityId = filters.entityId;

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
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

  /**
   * Get audit logs for a specific entity
   */
  static async getEntityLogs(entityType: string, entityId: number) {
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

  /**
   * Get audit logs for a specific user
   */
  static async getUserLogs(userId: number, page: number = 1, limit: number = 50) {
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

  /**
   * Get audit log statistics
   */
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
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
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

  /**
   * Helper method to log CRUD operations
   */
  static async logCRUD(
    userId: number,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ',
    entityType: string,
    entityId: number,
    oldValues?: any,
    newValues?: any,
    request?: { ip?: string; userAgent?: string }
  ) {
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
