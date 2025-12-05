import { Locale } from "@prisma/client";
export declare class OurPhilosophyService {
    static getPublicPhilosophies(locale: Locale): Promise<any>;
    static getAllPhilosophies(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createPhilosophy(data: any, userId: number): Promise<any>;
    static updatePhilosophy(philosophyId: number, data: any, userId: number): Promise<any>;
    static deletePhilosophy(philosophyId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=our-philosophy.service.d.ts.map