import { Request, Response, NextFunction } from "express";
export declare class AboutCardController {
    static listPublicCards(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllCards(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateCard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteCard(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=about-card.controller.d.ts.map