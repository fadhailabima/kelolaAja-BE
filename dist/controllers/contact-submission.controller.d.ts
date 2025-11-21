import { Request, Response } from "express";
export declare class ContactSubmissionController {
    static listAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static assign(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
    static getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=contact-submission.controller.d.ts.map