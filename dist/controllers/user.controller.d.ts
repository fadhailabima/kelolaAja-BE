import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map