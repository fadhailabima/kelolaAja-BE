import { Locale } from '@prisma/client';
export interface Translation {
    locale: Locale;
    [key: string]: any;
}
export interface MergedTranslations {
    id?: Record<string, any>;
    en?: Record<string, any>;
}
export interface PricingTranslationData {
    planName: string;
    pricePeriod?: string;
    userRange?: string;
    description?: string;
}
export interface FeatureTranslationData {
    featureName: string;
    description?: string;
}
export interface PartnerTranslationData {
    description?: string;
}
export interface TranslationInput<T> {
    id: T;
    en?: T;
}
//# sourceMappingURL=translation.d.ts.map