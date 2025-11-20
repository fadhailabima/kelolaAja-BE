import { Locale } from '@prisma/client';
export declare class BenefitStatService {
    static getPublicStats(locale: Locale): Promise<any>;
    static getAllStats(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createStat(data: any, userId: number): Promise<any>;
    static updateStat(statId: number, data: any, userId: number): Promise<any>;
    static deleteStat(statId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=benefit-stat.service.d.ts.map