import { Locale } from "@prisma/client";
type PageTranslationInput = {
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    aboutTitle?: string;
    aboutSubtitle?: string;
    aboutDescription1?: string;
    aboutDescription2?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
};
type ItemTranslationInput = {
    title?: string;
    description?: string;
    shortDescription?: string;
};
type CreatePagePayload = {
    featureId: number;
    pageCode: string;
    slug: string;
    heroImageFileId?: number | null;
    isActive?: boolean;
    translations: Partial<Record<Locale, PageTranslationInput>>;
};
type UpdatePagePayload = Partial<CreatePagePayload>;
type CreateItemPayload = {
    itemType?: string | null;
    imageFileId?: number | null;
    displayOrder: number;
    isActive?: boolean;
    translations: Partial<Record<Locale, ItemTranslationInput>>;
};
type UpdateItemPayload = Partial<CreateItemPayload>;
export declare class FeaturePageService {
    private static normalizeTranslations;
    private static ensurePage;
    private static ensureFeature;
    private static ensureMedia;
    private static formatPagePublic;
    private static formatItemPublic;
    static getPublicPages(locale: Locale, featureId?: number): Promise<{
        pageId: any;
        pageCode: any;
        slug: any;
        featureId: any;
        heroImage: {
            fileId: any;
            filePath: any;
            altText: any;
        } | null;
        heroTitle: any;
        heroSubtitle: any;
        heroDescription: any;
        aboutTitle: any;
        aboutSubtitle: any;
        aboutDescription1: any;
        aboutDescription2: any;
        ctaTitle: any;
        ctaDescription: any;
        ctaButtonText: any;
    }[]>;
    static getPublicPageBySlug(slug: string, locale: Locale): Promise<{
        items: {
            itemId: any;
            itemType: any;
            displayOrder: any;
            title: any;
            description: any;
            shortDescription: any;
            image: {
                fileId: any;
                filePath: any;
                altText: any;
            } | null;
        }[];
        pageId: any;
        pageCode: any;
        slug: any;
        featureId: any;
        heroImage: {
            fileId: any;
            filePath: any;
            altText: any;
        } | null;
        heroTitle: any;
        heroSubtitle: any;
        heroDescription: any;
        aboutTitle: any;
        aboutSubtitle: any;
        aboutDescription1: any;
        aboutDescription2: any;
        ctaTitle: any;
        ctaDescription: any;
        ctaButtonText: any;
    }>;
    static getPages(page: number, limit: number, search?: string, featureId?: number, isActive?: string): Promise<{
        data: {
            pageId: number;
            feature: {
                featureId: number;
                featureCode: string;
            };
            pageCode: string;
            slug: string;
            isActive: boolean;
            heroImage: {
                fileId: number;
                filePath: string;
                altText: string | null;
            } | null;
            itemsCount: number;
            createdAt: Date;
            updatedAt: Date;
            creator: {
                userId: number;
                username: string;
                email: string;
            };
            updater: {
                userId: number;
                username: string;
                email: string;
            };
            translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getPageDetail(pageId: number): Promise<{
        pageId: number;
        feature: {
            featureId: number;
            featureCode: string;
        };
        pageCode: string;
        slug: string;
        heroImage: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        isActive: boolean;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
        items: {
            itemId: number;
            itemType: string | null;
            displayOrder: number;
            isActive: boolean;
            image: {
                fileId: number;
                filePath: string;
                altText: string | null;
            } | null;
            translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
    }>;
    static createPage(data: CreatePagePayload, userId: number): Promise<{
        pageId: number;
        feature: {
            featureId: number;
            featureCode: string;
        };
        pageCode: string;
        slug: string;
        heroImage: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        isActive: boolean;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    private static buildPageTranslationPayload;
    static updatePage(pageId: number, data: UpdatePagePayload, userId: number): Promise<{
        pageId: number;
        feature: {
            featureId: number;
            featureCode: string;
        };
        pageCode: string;
        slug: string;
        heroImage: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        isActive: boolean;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
        items: {
            itemId: number;
            itemType: string | null;
            displayOrder: number;
            isActive: boolean;
            image: {
                fileId: number;
                filePath: string;
                altText: string | null;
            } | null;
            translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
    }>;
    static deletePage(pageId: number, userId: number): Promise<void>;
    static listItems(pageId: number): Promise<{
        itemId: number;
        itemType: string | null;
        displayOrder: number;
        isActive: boolean;
        image: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }[]>;
    static createItem(pageId: number, data: CreateItemPayload): Promise<{
        itemId: number;
        itemType: string | null;
        displayOrder: number;
        isActive: boolean;
        image: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    private static buildItemTranslationPayload;
    static updateItem(itemId: number, data: UpdateItemPayload): Promise<{
        itemId: number;
        itemType: string | null;
        displayOrder: number;
        isActive: boolean;
        image: {
            fileId: number;
            filePath: string;
            altText: string | null;
        } | null;
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static deleteItem(itemId: number): Promise<void>;
}
export {};
//# sourceMappingURL=feature-page.service.d.ts.map