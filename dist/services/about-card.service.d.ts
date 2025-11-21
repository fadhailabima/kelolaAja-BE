import { Locale } from "@prisma/client";
export declare class AboutCardService {
    static getPublicCards(locale: Locale): Promise<any>;
    static getAllCards(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createCard(data: any, userId: number): Promise<any>;
    static updateCard(cardId: number, data: any, userId: number): Promise<any>;
    static deleteCard(cardId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=about-card.service.d.ts.map