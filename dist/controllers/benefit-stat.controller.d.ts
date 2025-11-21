import { Request, Response, NextFunction } from "express";
export declare class BenefitStatController {
    static listPublicStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createStat(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateStat(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteStat(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=benefit-stat.controller.d.ts.map