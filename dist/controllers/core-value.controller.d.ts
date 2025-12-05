import { Request, Response, NextFunction } from "express";
export declare class CoreValueController {
    static listPublicValues(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllValues(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createValue(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateValue(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteValue(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=core-value.controller.d.ts.map