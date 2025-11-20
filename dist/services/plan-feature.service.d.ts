import { Locale } from '@prisma/client';
export declare class PlanFeatureService {
    static getPlanFeatures(planId: number, locale: Locale): Promise<any>;
    static addFeatureToPlan(data: any): Promise<{
        feature: {
            translations: {
                createdAt: Date;
                updatedAt: Date;
                featureId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                featureName: string | null;
            }[];
        } & {
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            createdBy: number;
            displayOrder: number;
            deletedAt: Date | null;
            updatedBy: number;
            featureId: number;
            featureCode: string;
            category: string | null;
        };
    } & {
        createdAt: Date;
        planId: number;
        displayOrder: number;
        featureId: number;
        isIncluded: boolean;
        listId: number;
    }>;
    static updatePlanFeature(listId: number, data: any): Promise<{
        feature: {
            translations: {
                createdAt: Date;
                updatedAt: Date;
                featureId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                featureName: string | null;
            }[];
        } & {
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            createdBy: number;
            displayOrder: number;
            deletedAt: Date | null;
            updatedBy: number;
            featureId: number;
            featureCode: string;
            category: string | null;
        };
    } & {
        createdAt: Date;
        planId: number;
        displayOrder: number;
        featureId: number;
        isIncluded: boolean;
        listId: number;
    }>;
    static removeFeatureFromPlan(listId: number): Promise<void>;
    static bulkAddFeatures(planId: number, features: any[]): Promise<{
        count: number;
        message: string;
    }>;
}
//# sourceMappingURL=plan-feature.service.d.ts.map