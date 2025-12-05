import { Request, Response, NextFunction } from "express";
import { CoreValueService } from "../services/core-value.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class CoreValueController {
  /**
   * Get all active core values (Public)
   */
  static async listPublicValues(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const values = await CoreValueService.getPublicValues(locale);
      ResponseUtil.success(res, "Core values retrieved successfully", values);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all values with all translations (Admin)
   */
  static async listAllValues(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await CoreValueService.getAllValues(page, limit, search, isActive);
      ResponseUtil.success(res, "Core values retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new core value
   */
  static async createValue(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const value = await CoreValueService.createValue(req.body, userId);
      ResponseUtil.success(res, "Core value created successfully", value, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update core value
   */
  static async updateValue(req: Request, res: Response, next: NextFunction) {
    try {
      const valueId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const value = await CoreValueService.updateValue(valueId, req.body, userId);
      ResponseUtil.success(res, "Core value updated successfully", value);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete core value
   */
  static async deleteValue(req: Request, res: Response, next: NextFunction) {
    try {
      const valueId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await CoreValueService.deleteValue(valueId, userId);
      ResponseUtil.success(res, "Core value deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
