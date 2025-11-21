import { Locale } from "@prisma/client";
export declare class PartnerService {
    static getPublicPartners(locale: Locale): Promise<any>;
    static getAllPartners(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createPartner(data: any, userId: number): Promise<any>;
    static updatePartner(partnerId: number, data: any, userId: number): Promise<any>;
    static deletePartner(partnerId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=partner.service.d.ts.map