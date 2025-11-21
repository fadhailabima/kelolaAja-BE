import { Locale } from "@prisma/client";
export declare class ProcessStepService {
    static getPublicSteps(locale: Locale): Promise<any>;
    static getAllSteps(page: number, limit: number, search?: string, isActive?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    static createStep(data: any, userId: number): Promise<any>;
    static updateStep(stepId: number, data: any, userId: number): Promise<any>;
    static deleteStep(stepId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=process-step.service.d.ts.map