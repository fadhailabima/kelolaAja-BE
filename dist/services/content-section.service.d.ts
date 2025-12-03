import { Locale } from '@prisma/client';
export declare class ContentSectionService {
    static getPublicSections(locale: Locale, pageLocation?: string): Promise<any>;
    static getPublicSectionByKey(sectionKey: string, locale: Locale): Promise<{
        sectionId: any;
        sectionType: any;
        sectionKey: any;
        pageLocation: any;
        displayOrder: any;
        metadata: any;
        title: any;
        subtitle: any;
        description: any;
        content: any;
        additionalData: any;
        media: any;
    }>;
    static getAllSections(page?: number, limit?: number, pageLocation?: string): Promise<{
        data: {
            sectionId: any;
            sectionType: any;
            sectionKey: any;
            pageLocation: any;
            displayOrder: any;
            isActive: any;
            metadata: any;
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<import("../../src/utils/translation").Translation, "locale">>;
            media: any;
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
        sectionType: string;
        sectionKey: string;
        pageLocation?: string;
        displayOrder: number;
        isActive?: boolean;
        metadata?: any;
        translations: {
            id: {
                title?: string;
                subtitle?: string;
                description?: string;
                content?: string;
                additionalData?: any;
            };
            en: {
                title?: string;
                subtitle?: string;
                description?: string;
                content?: string;
                additionalData?: any;
            };
        };
        createdBy: number;
    }): Promise<{
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<{
            createdAt: Date;
            updatedAt: Date;
            sectionId: number;
            title: string | null;
            description: string | null;
            locale: import(".prisma/client/client").$Enums.Locale;
            translationId: number;
            subtitle: string | null;
            content: string | null;
            additionalData: import("@prisma/client/runtime/library").JsonValue | null;
        }, "locale">>;
        media: ({
            mediaFile: {
                createdAt: Date;
                deletedAt: Date | null;
                fileId: number;
                fileName: string;
                filePath: string;
                fileType: string | null;
                mimeType: string | null;
                fileSize: bigint | null;
                width: number | null;
                height: number | null;
                altText: string | null;
                storageType: string | null;
                storageUrl: string | null;
                isPublic: boolean;
                uploadedBy: number | null;
            };
        } & {
            createdAt: Date;
            displayOrder: number | null;
            sectionId: number;
            fileId: number;
            contentMediaId: number;
            mediaType: string | null;
            usage: string | null;
        })[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        displayOrder: number;
        deletedAt: Date | null;
        updatedBy: number;
        sectionId: number;
        sectionType: string;
        sectionKey: string;
        pageLocation: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    static updateSection(sectionId: number, data: {
        sectionType?: string;
        pageLocation?: string;
        displayOrder?: number;
        isActive?: boolean;
        metadata?: any;
        translations?: {
            id?: {
                title?: string;
                subtitle?: string;
                description?: string;
                content?: string;
                additionalData?: any;
            };
            en?: {
                title?: string;
                subtitle?: string;
                description?: string;
                content?: string;
                additionalData?: any;
            };
        };
        updatedBy: number;
    }): Promise<{
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<{
            createdAt: Date;
            updatedAt: Date;
            sectionId: number;
            title: string | null;
            description: string | null;
            locale: import(".prisma/client/client").$Enums.Locale;
            translationId: number;
            subtitle: string | null;
            content: string | null;
            additionalData: import("@prisma/client/runtime/library").JsonValue | null;
        }, "locale">>;
        media?: ({
            mediaFile: {
                createdAt: Date;
                deletedAt: Date | null;
                fileId: number;
                fileName: string;
                filePath: string;
                fileType: string | null;
                mimeType: string | null;
                fileSize: bigint | null;
                width: number | null;
                height: number | null;
                altText: string | null;
                storageType: string | null;
                storageUrl: string | null;
                isPublic: boolean;
                uploadedBy: number | null;
            };
        } & {
            createdAt: Date;
            displayOrder: number | null;
            sectionId: number;
            fileId: number;
            contentMediaId: number;
            mediaType: string | null;
            usage: string | null;
        })[] | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        createdBy?: number | undefined;
        displayOrder?: number | undefined;
        deletedAt?: Date | null | undefined;
        updatedBy?: number | undefined;
        sectionId?: number | undefined;
        sectionType?: string | undefined;
        sectionKey?: string | undefined;
        pageLocation?: string | null | undefined;
        metadata?: import("@prisma/client/runtime/library").JsonValue | undefined;
    }>;
    static deleteSection(sectionId: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=content-section.service.d.ts.map