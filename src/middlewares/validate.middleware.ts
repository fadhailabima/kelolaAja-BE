// src/middlewares/validate.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { ResponseUtil } from "../utils/response";

/**
 * Middleware to validate request data against a Zod schema
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      }) as any;

      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }));

        ResponseUtil.badRequest(res, "Validation failed", errors);
        return;
      }

      next(error);
    }
  };
};
