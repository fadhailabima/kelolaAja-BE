import { Request, Response, NextFunction } from "express";
export declare class PlanFeatureController {
    static getPlanFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
    static addFeatureToPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePlanFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    static removeFeatureFromPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static bulkAddFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=plan-feature.controller.d.ts.map