export declare class AuditLogService {
    static createLog(data: {
        userId: number;
        actionType: string;
        entityType: string;
        entityId?: number;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        user: {
            userId: number;
            username: string;
            email: string;
        };
    } & {
        userId: number;
        createdAt: Date;
        logId: number;
        actionType: string;
        entityType: string;
        entityId: number | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
    static getAllLogs(page?: number, limit?: number, filters?: {
        userId?: number;
        actionType?: string;
        entityType?: string;
        entityId?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: ({
            user: {
                userId: number;
                username: string;
                email: string;
            };
        } & {
            userId: number;
            createdAt: Date;
            logId: number;
            actionType: string;
            entityType: string;
            entityId: number | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getEntityLogs(entityType: string, entityId: number): Promise<({
        user: {
            userId: number;
            username: string;
            email: string;
        };
    } & {
        userId: number;
        createdAt: Date;
        logId: number;
        actionType: string;
        entityType: string;
        entityId: number | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
    static getUserLogs(userId: number, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                userId: number;
                username: string;
                email: string;
            };
        } & {
            userId: number;
            createdAt: Date;
            logId: number;
            actionType: string;
            entityType: string;
            entityId: number | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getLogStats(): Promise<{
        totalLogs: number;
        byActionType: {
            actionType: string;
            count: number;
        }[];
        byEntityType: {
            entityType: string;
            count: number;
        }[];
        recentActivity: number;
    }>;
    static logCRUD(userId: number, action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ', entityType: string, entityId: number, oldValues?: any, newValues?: any, request?: {
        ip?: string;
        userAgent?: string;
    }): Promise<{
        user: {
            userId: number;
            username: string;
            email: string;
        };
    } & {
        userId: number;
        createdAt: Date;
        logId: number;
        actionType: string;
        entityType: string;
        entityId: number | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
//# sourceMappingURL=audit-log.service.d.ts.map