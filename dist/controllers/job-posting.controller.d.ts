import { Request, Response, NextFunction } from "express";
export declare class JobPostingController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStats(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=job-posting.controller.d.ts.map