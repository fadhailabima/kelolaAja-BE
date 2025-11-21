import { Locale } from "@prisma/client";
export declare class FAQCategoryService {
    static getPublicCategories(locale: Locale): Promise<any>;
    static getAllCategories(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createCategory(data: any, userId: number): Promise<any>;
    static updateCategory(categoryId: number, data: any, userId: number): Promise<any>;
    static deleteCategory(categoryId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=faq-category.service.d.ts.map