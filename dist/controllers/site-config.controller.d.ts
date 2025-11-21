import { Request, Response } from 'express';
export declare class SiteConfigController {
    static listPublic(_req: Request, res: Response): Promise<void>;
    static getByKey(req: Request, res: Response): Promise<void>;
    static listAll(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static updateByKey(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
    static bulkUpdate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=site-config.controller.d.ts.map