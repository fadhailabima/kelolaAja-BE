import { Request, Response, NextFunction } from "express";
export declare class ERPBenefitController {
    static listPublicBenefits(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllBenefits(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createBenefit(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateBenefit(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteBenefit(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=erp-benefit.controller.d.ts.map