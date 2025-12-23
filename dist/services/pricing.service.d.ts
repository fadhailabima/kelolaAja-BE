import { Locale } from '@prisma/client';
export declare class PricingService {
    static getPublicPlans(_locale: Locale): Promise<any>;
    static getPublicPlanById(planId: number, _locale: Locale): Promise<{
        planId: any;
        planCode: any;
        pricePerUserMonth: any;
        minUsers: any;
        maxUsers: any;
        displayOrder: any;
        badgeColor: any;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<import("../utils/translation").Translation, "locale">>;
        features: any;
    }>;
    static getAllPlans(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createPlan(data: any, userId: number): Promise<any>;
    static updatePlan(planId: number, data: any, userId: number): Promise<any>;
    static deletePlan(planId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=pricing.service.d.ts.map