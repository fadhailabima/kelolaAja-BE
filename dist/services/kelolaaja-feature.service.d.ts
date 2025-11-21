import { Locale } from "@prisma/client";
export declare class KelolaAjaFeatureService {
    static getPublicFeatures(locale: Locale): Promise<any>;
    static getAllFeatures(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createFeature(data: any, userId: number): Promise<any>;
    static updateFeature(featureId: number, data: any, userId: number): Promise<any>;
    static deleteFeature(featureId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=kelolaaja-feature.service.d.ts.map