import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";
import { FeatureService } from "../services/feature.service";

export class FeatureController {
  /**
   * GET /api/features
   * Get all active features (Public endpoint)
   */
  static async listPublicFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const category = req.query.category as string;

      const features = await FeatureService.getPublicFeatures(locale, category);
      ResponseUtil.success(res, "Features retrieved successfully", features);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/features/:id
   * Get single feature by ID (Public endpoint)
   */
  static async getPublicFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featureId = parseInt(req.params.id);
      const locale = req.locale || Locale.id;

      const feature = await FeatureService.getPublicFeatureById(featureId, locale);
      ResponseUtil.success(res, "Feature retrieved successfully", feature);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/features/categories
   * Get unique feature categories (Public endpoint)
   */
  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await FeatureService.getCategories();
      ResponseUtil.success(res, "Categories retrieved successfully", categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/features
   * Get all features with all translations (Admin only)
   */
  static async listAllFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const isActive = req.query.isActive as string;

      const result = await FeatureService.getAllFeatures(page, limit, search, category, isActive);

      ResponseUtil.success(res, "Features retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/features
   * Create new feature (Admin only)
   */
  static async createFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FeatureService.createFeature(req.body, req.user!.userId);
      ResponseUtil.created(res, "Feature created successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/features/:id
   * Update feature (Admin only)
   */
  static async updateFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featureId = parseInt(req.params.id);
      const result = await FeatureService.updateFeature(featureId, req.body, req.user!.userId);
      ResponseUtil.success(res, "Feature updated successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/features/:id
   * Soft delete feature (Admin only)
   */
  static async deleteFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featureId = parseInt(req.params.id);
      await FeatureService.deleteFeature(featureId, req.user!.userId);
      ResponseUtil.success(res, "Feature deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
