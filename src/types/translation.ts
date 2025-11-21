import { Locale } from "@prisma/client";

/**
 * Generic translation interface for all translation tables
 */
export interface Translation {
  locale: Locale;
  [key: string]: any;
}

/**
 * Merged translations object structure for admin API responses
 * Example: { id: { name: "..." }, en: { name: "..." } }
 */
export interface MergedTranslations {
  id?: Record<string, any>;
  en?: Record<string, any>;
}

/**
 * Pricing plan translation structure
 */
export interface PricingTranslationData {
  planName: string;
  pricePeriod?: string;
  userRange?: string;
  description?: string;
}

/**
 * Feature translation structure
 */
export interface FeatureTranslationData {
  featureName: string;
  description?: string;
}

/**
 * Partner translation structure
 */
export interface PartnerTranslationData {
  description?: string;
}

/**
 * Generic translation input for create/update operations
 */
export interface TranslationInput<T> {
  id: T;
  en?: T;
}
