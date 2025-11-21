import { Request, Response, NextFunction } from "express";
export declare class ProcessStepController {
    static listPublicSteps(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllSteps(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createStep(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateStep(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteStep(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=process-step.controller.d.ts.map