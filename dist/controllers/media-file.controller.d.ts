import { Request, Response } from 'express';
export declare class MediaFileController {
    static listAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static upload(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
    static getStats(_req: Request, res: Response): Promise<void>;
    static serveFile(req: Request, res: Response): Promise<void>;
    static downloadFile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=media-file.controller.d.ts.map