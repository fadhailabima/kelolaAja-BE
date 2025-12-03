import { Locale } from "@prisma/client";
type IndustryTranslationInput = {
    title?: string;
    description?: string;
    introText?: string;
};
type ProblemSolutionTranslationInput = {
    title?: string;
    description?: string;
};
type CreateIndustryPayload = {
    industryCode: string;
    slug: string;
    displayOrder: number;
    isActive?: boolean;
    translations: Partial<Record<Locale, IndustryTranslationInput>>;
};
type UpdateIndustryPayload = Partial<CreateIndustryPayload>;
type ProblemPayload = {
    displayOrder: number;
    isActive?: boolean;
    translations: Partial<Record<Locale, ProblemSolutionTranslationInput>>;
};
type UpdateProblemPayload = Partial<ProblemPayload>;
type MediaPayload = {
    fileId: number;
    mediaType?: string | null;
    usage?: string | null;
    displayOrder?: number | null;
};
type UpdateMediaPayload = Partial<MediaPayload>;
export declare class IndustryService {
    private static ensureIndustry;
    private static normalizeTranslations;
    private static formatContentPublic;
    private static formatIndustryPublic;
    private static buildIndustryTranslationPayload;
    private static buildTranslationPayload;
    static getPublicIndustries(locale: Locale): Promise<{
        industryId: any;
        industryCode: any;
        slug: any;
        displayOrder: any;
        title: any;
        description: any;
        introText: any;
        problems: any;
        solutions: any;
        media: any;
    }[]>;
    static getPublicIndustryBySlug(slug: string, locale: Locale): Promise<{
        industryId: any;
        industryCode: any;
        slug: any;
        displayOrder: any;
        title: any;
        description: any;
        introText: any;
        problems: any;
        solutions: any;
        media: any;
    }>;
    static getIndustries(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: {
            industryId: number;
            industryCode: string;
            slug: string;
            displayOrder: number;
            isActive: boolean;
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
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
            problems: {
                problemId: number;
                displayOrder: number;
                isActive: boolean;
                translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                    locale: Locale;
                }, "locale">>;
            }[];
            solutions: {
                solutionId: number;
                displayOrder: number;
                isActive: boolean;
                translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                    locale: Locale;
                }, "locale">>;
            }[];
            media: {
                industryMediaId: number;
                mediaType: string | null;
                usage: string | null;
                displayOrder: number | null;
                file: {
                    fileId: number;
                    fileName: string;
                    filePath: string;
                    altText: string | null;
                };
            }[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getIndustryDetail(industryId: number): Promise<{
        industryId: number;
        industryCode: string;
        slug: string;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
        problems: {
            problemId: number;
            displayOrder: number;
            isActive: boolean;
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
        solutions: {
            solutionId: number;
            displayOrder: number;
            isActive: boolean;
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
        media: {
            industryMediaId: number;
            mediaType: string | null;
            usage: string | null;
            displayOrder: number | null;
            file: {
                fileId: number;
                fileName: string;
                filePath: string;
                altText: string | null;
            };
        }[];
    }>;
    static createIndustry(data: CreateIndustryPayload, userId: number): Promise<{
        industryId: number;
        industryCode: string;
        slug: string;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static updateIndustry(industryId: number, data: UpdateIndustryPayload, userId: number): Promise<{
        industryId: number;
        industryCode: string;
        slug: string;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
        problems: {
            problemId: number;
            displayOrder: number;
            isActive: boolean;
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
        solutions: {
            solutionId: number;
            displayOrder: number;
            isActive: boolean;
            translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
                locale: Locale;
            }, "locale">>;
        }[];
        media: {
            industryMediaId: number;
            mediaType: string | null;
            usage: string | null;
            displayOrder: number | null;
            file: {
                fileId: number;
                fileName: string;
                filePath: string;
                altText: string | null;
            };
        }[];
    }>;
    static deleteIndustry(industryId: number, userId: number): Promise<void>;
    static listProblems(industryId: number): Promise<{
        problemId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }[]>;
    static createProblem(industryId: number, data: ProblemPayload): Promise<{
        problemId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static updateProblem(problemId: number, data: UpdateProblemPayload): Promise<{
        problemId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static deleteProblem(problemId: number): Promise<void>;
    static listSolutions(industryId: number): Promise<{
        solutionId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }[]>;
    static createSolution(industryId: number, data: ProblemPayload): Promise<{
        solutionId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static updateSolution(solutionId: number, data: UpdateProblemPayload): Promise<{
        solutionId: number;
        displayOrder: number;
        isActive: boolean;
        translations: Record<import(".prisma/client/client").$Enums.Locale, Omit<Record<string, any> & {
            locale: Locale;
        }, "locale">>;
    }>;
    static deleteSolution(solutionId: number): Promise<void>;
    static listMedia(industryId: number): Promise<{
        industryMediaId: number;
        mediaType: string | null;
        usage: string | null;
        displayOrder: number | null;
        file: {
            fileId: number;
            fileName: string;
            filePath: string;
            altText: string | null;
        };
    }[]>;
    static addMedia(industryId: number, data: MediaPayload): Promise<{
        industryMediaId: number;
        mediaType: string | null;
        usage: string | null;
        displayOrder: number | null;
        file: {
            fileId: number;
            fileName: string;
            filePath: string;
            altText: string | null;
        };
    }>;
    static updateMedia(industryMediaId: number, data: UpdateMediaPayload): Promise<{
        industryMediaId: number;
        mediaType: string | null;
        usage: string | null;
        displayOrder: number | null;
        file: {
            fileId: number;
            fileName: string;
            filePath: string;
            altText: string | null;
        };
    }>;
    static deleteMedia(industryMediaId: number): Promise<void>;
}
export {};
//# sourceMappingURL=industry.service.d.ts.map