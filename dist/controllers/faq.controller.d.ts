import { Request, Response, NextFunction } from "express";
export declare class FAQController {
    static listPublicFAQs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listPublicFAQsByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPublicFAQ(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllFAQs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFAQ(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFAQ(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteFAQ(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=faq.controller.d.ts.map