import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';
import { PricingService } from '../services/pricing.service';

export class PricingController {
  /**
   * GET /api/pricing-plans
   * Get all active pricing plans (Public endpoint)
   */
  static async listPublicPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const plans = await PricingService.getPublicPlans(locale);
      ResponseUtil.success(res, 'Pricing plans retrieved successfully', plans);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pricing-plans/:id
   * Get single pricing plan by ID (Public endpoint)
   */
  static async getPublicPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planId = parseInt(req.params.id);
      const locale = req.locale || Locale.id;
      const plan = await PricingService.getPublicPlanById(planId, locale);
      ResponseUtil.success(res, 'Pricing plan retrieved successfully', plan);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/pricing-plans
   * Get all pricing plans with all translations (Admin only)
   */
  static async listAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.isActive as string;

      const result = await PricingService.getAllPlans(page, limit, search, isActive);

      ResponseUtil.success(
        res,
        'Pricing plans retrieved successfully',
        result.data,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/pricing-plans
   * Create new pricing plan (Admin only)
   */
  static async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PricingService.createPlan(req.body, req.user!.userId);
      ResponseUtil.created(res, 'Pricing plan created successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/pricing-plans/:id
   * Update pricing plan (Admin only)
   */
  static async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planId = parseInt(req.params.id);
      const result = await PricingService.updatePlan(planId, req.body, req.user!.userId);
      ResponseUtil.success(res, 'Pricing plan updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/pricing-plans/:id
   * Soft delete pricing plan (Admin only)
   */
  static async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planId = parseInt(req.params.id);
      await PricingService.deletePlan(planId, req.user!.userId);
      ResponseUtil.success(res, 'Pricing plan deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
