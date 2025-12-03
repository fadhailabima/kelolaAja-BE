import { Request, Response, NextFunction } from "express";
export declare class AnalyticsController {
    static trackVisitor(req: Request, res: Response, next: NextFunction): Promise<void>;
    static trackPageView(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getVisitors(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getVisitorDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPageViews(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTopPages(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=analytics.controller.d.ts.map