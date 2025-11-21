import { Request, Response, NextFunction } from "express";
export declare class FeaturePageController {
    static listPublicPages(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPublicPage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listPages(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPageDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listItems(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteItem(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=feature-page.controller.d.ts.map