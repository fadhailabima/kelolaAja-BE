import { Locale } from "@prisma/client";
export declare class ERPBenefitService {
    static getPublicBenefits(locale: Locale): Promise<any>;
    static getAllBenefits(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createBenefit(data: any, userId: number): Promise<any>;
    static updateBenefit(benefitId: number, data: any, userId: number): Promise<any>;
    static deleteBenefit(benefitId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=erp-benefit.service.d.ts.map