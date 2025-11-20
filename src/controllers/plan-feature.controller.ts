import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';
import { PlanFeatureService } from '../services/plan-feature.service';

export class PlanFeatureController {
  /**
   * GET /api/pricing-plans/:planId/features
   * Get all features for a specific plan (Public endpoint)
   */
  static async getPlanFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planId = parseInt(req.params.planId);
      const locale = req.locale || Locale.id;

      const features = await PlanFeatureService.getPlanFeatures(planId, locale);
      ResponseUtil.success(res, 'Plan features retrieved successfully', features);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/plan-features
   * Add a feature to a plan (Admin only)
   */
  static async addFeatureToPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PlanFeatureService.addFeatureToPlan(req.body);
      ResponseUtil.created(res, 'Feature added to plan successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/plan-features/:id
   * Update plan feature (Admin only)
   */
  static async updatePlanFeature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listId = parseInt(req.params.id);
      const result = await PlanFeatureService.updatePlanFeature(listId, req.body);
      ResponseUtil.success(res, 'Plan feature updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/plan-features/:id
   * Remove feature from plan (Admin only)
   */
  static async removeFeatureFromPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listId = parseInt(req.params.id);
      await PlanFeatureService.removeFeatureFromPlan(listId);
      ResponseUtil.success(res, 'Feature removed from plan successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/pricing-plans/:planId/features/bulk
   * Bulk add features to a plan (Admin only)
   */
  static async bulkAddFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planId = parseInt(req.params.planId);
      const { features } = req.body;

      const result = await PlanFeatureService.bulkAddFeatures(planId, features);
      ResponseUtil.created(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }
}
