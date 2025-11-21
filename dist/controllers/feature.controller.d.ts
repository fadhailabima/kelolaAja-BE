import { Request, Response, NextFunction } from "express";
export declare class FeatureController {
    static listPublicFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPublicFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=feature.controller.d.ts.map