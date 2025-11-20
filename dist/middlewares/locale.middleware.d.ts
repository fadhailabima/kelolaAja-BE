import { Request, Response, NextFunction } from "express";
import { Locale } from "@prisma/client";
declare global {
    namespace Express {
        interface Request {
            locale?: Locale;
        }
    }
}
export declare const detectLocale: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=locale.middleware.d.ts.map