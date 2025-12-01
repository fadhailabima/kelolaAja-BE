import { Request, Response, NextFunction } from "express";
export declare class JobApplicationController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=job-application.controller.d.ts.map