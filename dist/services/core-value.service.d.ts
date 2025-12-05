import { Locale } from "@prisma/client";
export declare class CoreValueService {
    static getPublicValues(locale: Locale): Promise<any>;
    static getAllValues(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createValue(data: any, userId: number): Promise<any>;
    static updateValue(valueId: number, data: any, userId: number): Promise<any>;
    static deleteValue(valueId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=core-value.service.d.ts.map