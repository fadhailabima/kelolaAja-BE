import { Request, Response, NextFunction } from "express";
import { OurPhilosophyService } from "../services/our-philosophy.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class OurPhilosophyController {
  /**
   * Get all active philosophies (Public)
   */
  static async listPublicPhilosophies(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const philosophies = await OurPhilosophyService.getPublicPhilosophies(locale);
      ResponseUtil.success(res, "Our philosophies retrieved successfully", philosophies);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all philosophies with all translations (Admin)
   */
  static async listAllPhilosophies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await OurPhilosophyService.getAllPhilosophies(page, limit, search, isActive);
      ResponseUtil.success(res, "Our philosophies retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new philosophy
   */
  static async createPhilosophy(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const philosophy = await OurPhilosophyService.createPhilosophy(req.body, userId);
      ResponseUtil.success(res, "Philosophy created successfully", philosophy, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update philosophy
   */
  static async updatePhilosophy(req: Request, res: Response, next: NextFunction) {
    try {
      const philosophyId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const philosophy = await OurPhilosophyService.updatePhilosophy(philosophyId, req.body, userId);
      ResponseUtil.success(res, "Philosophy updated successfully", philosophy);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete philosophy
   */
  static async deletePhilosophy(req: Request, res: Response, next: NextFunction) {
    try {
      const philosophyId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await OurPhilosophyService.deletePhilosophy(philosophyId, userId);
      ResponseUtil.success(res, "Philosophy deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
