import { Request, Response, NextFunction } from "express";
export declare class OurPhilosophyController {
    static listPublicPhilosophies(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllPhilosophies(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPhilosophy(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePhilosophy(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePhilosophy(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=our-philosophy.controller.d.ts.map