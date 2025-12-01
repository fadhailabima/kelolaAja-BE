import { Response } from "express";
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export declare class ResponseUtil {
    static success<T>(res: Response, message: string, data?: T, statusCode?: number, meta?: ApiResponse["meta"]): void;
    static error(res: Response, message: string, errors?: any, statusCode?: number): void;
    static created<T>(res: Response, message: string, data?: T): void;
    static unauthorized(res: Response, message?: string): void;
    static forbidden(res: Response, message?: string): void;
    static notFound(res: Response, message?: string): void;
    static serverError(res: Response, message?: string, errors?: any): void;
    static badRequest(res: Response, message?: string, errors?: any): void;
}
//# sourceMappingURL=response.d.ts.map