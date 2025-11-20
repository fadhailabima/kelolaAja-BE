import { Request, Response, NextFunction } from 'express';
export declare class FAQCategoryController {
    static listPublicCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=faq-category.controller.d.ts.map