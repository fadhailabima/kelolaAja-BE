import { TranslationInput } from "../../src/types/translation";
export interface BaseCreateInput {
    createdBy: number;
}
export interface BaseUpdateInput {
    updatedBy: number;
}
export interface CreatePricingPlanInput {
    planCode: string;
    pricePerUserMonth: number;
    minUsers: number;
    maxUsers?: number;
    displayOrder: number;
    badgeColor?: string;
    translations: TranslationInput<{
        planName: string;
        pricePeriod?: string;
        userRange?: string;
        description?: string;
    }>;
}
export interface UpdatePricingPlanInput {
    planCode?: string;
    pricePerUserMonth?: number;
    minUsers?: number;
    maxUsers?: number;
    displayOrder?: number;
    badgeColor?: string;
    isActive?: boolean;
    translations?: TranslationInput<{
        planName: string;
        pricePeriod?: string;
        userRange?: string;
        description?: string;
    }>;
}
export interface CreateFeatureInput {
    featureCode: string;
    category: string;
    displayOrder: number;
    translations: TranslationInput<{
        featureName: string;
        description?: string;
    }>;
}
export interface UpdateFeatureInput {
    featureCode?: string;
    category?: string;
    displayOrder?: number;
    isActive?: boolean;
    translations?: TranslationInput<{
        featureName: string;
        description?: string;
    }>;
}
export interface CreatePartnerInput {
    partnerName: string;
    logoFileId?: number;
    displayOrder: number;
    translations: TranslationInput<{
        description?: string;
    }>;
}
export interface UpdatePartnerInput {
    partnerName?: string;
    logoFileId?: number;
    displayOrder?: number;
    isActive?: boolean;
    translations?: TranslationInput<{
        description?: string;
    }>;
}
export interface AddPlanFeatureInput {
    planId: number;
    featureId: number;
    isIncluded?: boolean;
    displayOrder: number;
}
export interface UpdatePlanFeatureInput {
    isIncluded?: boolean;
    displayOrder?: number;
}
export interface BulkAddPlanFeatureInput {
    featureId: number;
    isIncluded?: boolean;
    displayOrder: number;
}
//# sourceMappingURL=service.d.ts.map