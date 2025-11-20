import { Locale } from '@prisma/client';
export declare class FeatureService {
    static getPublicFeatures(locale: Locale, category?: string): Promise<any>;
    static getPublicFeatureById(featureId: number, locale: Locale): Promise<{
        featureId: any;
        featureCode: any;
        category: any;
        displayOrder: any;
        featureName: any;
        description: any;
    }>;
    static getCategories(): Promise<(string | null)[]>;
    static getAllFeatures(page: number, limit: number, search?: string, category?: string, isActive?: string): Promise<{
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
//# sourceMappingURL=feature.service.d.ts.map