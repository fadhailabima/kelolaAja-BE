import { Request, Response, NextFunction } from 'express';
export declare class PartnerController {
    static listPublicPartners(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllPartners(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPartner(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePartner(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePartner(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=partner.controller.d.ts.map