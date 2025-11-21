import { Request, Response } from 'express';
export declare class AuditLogController {
    static listAll(req: Request, res: Response): Promise<void>;
    static getEntityLogs(req: Request, res: Response): Promise<void>;
    static getUserLogs(req: Request, res: Response): Promise<void>;
    static getStats(_req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=audit-log.controller.d.ts.map