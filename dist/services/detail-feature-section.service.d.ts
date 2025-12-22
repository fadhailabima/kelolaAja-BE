import { Locale } from '@prisma/client';
export declare class DetailFeatureSectionService {
    static getPublicSections(locale: Locale, category?: string): Promise<any>;
    static getAllSections(page?: number, limit?: number, category?: string): Promise<{
        data: {
            sectionId: any;
            sectionCode: any;
            category: any;
            displayOrder: any;
            iconFileId: any;
            isActive: any;
            icon: any;
            translations: Record<import(".prisma/client").$Enums.Locale, Omit<import("../utils/translation").Translation, "locale">>;
            createdBy: any;
            createdAt: any;
            updatedAt: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static createSection(data: {
        category?: string;
        displayOrder: number;
        iconFileId?: number;
        isActive?: boolean;
        translations: {
            id: {
                title: string;
                description?: string;
            };
            en: {
                title: string;
                description?: string;
            };
        };
        createdBy: number;
    }): Promise<{
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<{
            createdAt: Date;
            updatedAt: Date;
            sectionId: number;
            title: string | null;
            description: string | null;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
        }, "locale">>;
        iconFile: {
            fileId: number;
            filePath: string;
            mimeType: string | null;
            altText: string | null;
        } | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        displayOrder: number;
        deletedAt: Date | null;
        updatedBy: number;
        category: string | null;
        sectionId: number;
        sectionCode: string;
        iconFileId: number | null;
    }>;
    static updateSection(sectionId: number, data: {
        category?: string;
        displayOrder?: number;
        iconFileId?: number;
        isActive?: boolean;
        translations?: {
            id?: {
                title?: string;
                description?: string;
            };
            en?: {
                title?: string;
                description?: string;
            };
        };
        updatedBy: number;
    }): Promise<{
        translations: Record<import(".prisma/client").$Enums.Locale, Omit<{
            createdAt: Date;
            updatedAt: Date;
            sectionId: number;
            title: string | null;
            description: string | null;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
        }, "locale">>;
        iconFile?: {
            fileId: number;
            filePath: string;
            mimeType: string | null;
            altText: string | null;
        } | null | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        createdBy?: number | undefined;
        displayOrder?: number | undefined;
        deletedAt?: Date | null | undefined;
        updatedBy?: number | undefined;
        category?: string | null | undefined;
        sectionId?: number | undefined;
        sectionCode?: string | undefined;
        iconFileId?: number | null | undefined;
    }>;
    static deleteSection(sectionId: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=detail-feature-section.service.d.ts.map