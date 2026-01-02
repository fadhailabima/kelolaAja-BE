import { Request, Response, NextFunction } from "express";
import { AdvancedFeatureService } from "../services/advanced-feature.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class AdvancedFeatureController {
  /**
   * Get all active advanced features (Public)
   */
  static async listPublicFeatures(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const features = await AdvancedFeatureService.getPublicFeatures(locale);
      ResponseUtil.success(res, "Advanced features retrieved successfully", features);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all features with all translations (Admin)
   */
  static async listAllFeatures(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await AdvancedFeatureService.getAllFeatures(page, limit, search, isActive);
      ResponseUtil.success(res, "Features retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new feature
   */
  static async createFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const feature = await AdvancedFeatureService.createFeature(req.body, userId);
      ResponseUtil.success(res, "Feature created successfully", feature, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update feature
   */
  static async updateFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const featureId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const feature = await AdvancedFeatureService.updateFeature(featureId, req.body, userId);
      ResponseUtil.success(res, "Feature updated successfully", feature);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete feature
   */
  static async deleteFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const featureId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await AdvancedFeatureService.deleteFeature(featureId, userId);
      ResponseUtil.success(res, "Feature deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
