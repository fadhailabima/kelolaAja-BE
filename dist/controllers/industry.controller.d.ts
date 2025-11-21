import { Request, Response, NextFunction } from "express";
export declare class IndustryController {
    static listPublicIndustries(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPublicIndustry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listIndustries(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getIndustryDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createIndustry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateIndustry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteIndustry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listProblems(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createProblem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateProblem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteProblem(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listSolutions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createSolution(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSolution(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteSolution(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listMedia(req: Request, res: Response, next: NextFunction): Promise<void>;
    static addMedia(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateMedia(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=industry.controller.d.ts.map