import { Locale } from '@prisma/client';
export declare class FAQService {
    static getPublicFAQs(locale: Locale, categoryId?: number): Promise<any>;
    static getPublicFAQsByCategory(locale: Locale): Promise<any>;
    static getPublicFAQById(faqId: number, locale: Locale): Promise<{
        faqId: any;
        displayOrder: any;
        question: any;
        answer: any;
        category: {
            categoryId: any;
            categoryCode: any;
            categoryName: any;
        } | null;
    }>;
    static getAllFAQs(page: number, limit: number, search?: string, categoryId?: number, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createFAQ(data: any, userId: number): Promise<any>;
    static updateFAQ(faqId: number, data: any, userId: number): Promise<any>;
    static deleteFAQ(faqId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=faq.service.d.ts.map