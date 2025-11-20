import { Locale } from '@prisma/client';
export declare class TestimonialService {
    static getPublicTestimonials(locale: Locale, isFeatured?: boolean): Promise<any>;
    static getPublicTestimonialById(testimonialId: number, locale: Locale): Promise<{
        testimonialId: any;
        name: any;
        title: any;
        company: any;
        rating: any;
        isFeatured: any;
        displayOrder: any;
        quote: any;
        photo: {
            fileId: any;
            filePath: any;
            altText: any;
        } | null;
    }>;
    static getAllTestimonials(page: number, limit: number, search?: string, isFeatured?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createTestimonial(data: any, userId: number): Promise<any>;
    static updateTestimonial(testimonialId: number, data: any, userId: number): Promise<any>;
    static deleteTestimonial(testimonialId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=testimonial.service.d.ts.map