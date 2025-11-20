import { Request, Response, NextFunction } from "express";
export declare class AuthController {
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
    static logout(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map