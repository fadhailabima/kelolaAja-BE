import { Request, Response, NextFunction } from 'express';
export declare class PricingController {
    static listPublicPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPublicPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=pricing.controller.d.ts.map