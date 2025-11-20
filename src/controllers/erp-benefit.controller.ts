import { Request, Response, NextFunction } from 'express';
import { ERPBenefitService } from '../services/erp-benefit.service';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';

export class ERPBenefitController {
  /**
   * Get all active ERP benefits (Public)
   */
  static async listPublicBenefits(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const benefits = await ERPBenefitService.getPublicBenefits(locale);
      ResponseUtil.success(res, 'ERP benefits retrieved successfully', benefits);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all benefits with all translations (Admin)
   */
  static async listAllBenefits(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await ERPBenefitService.getAllBenefits(page, limit, search, isActive);
      ResponseUtil.success(res, 'Benefits retrieved successfully', result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new benefit
   */
  static async createBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const benefit = await ERPBenefitService.createBenefit(req.body, userId);
      ResponseUtil.success(res, 'Benefit created successfully', benefit, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update benefit
   */
  static async updateBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const benefitId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const benefit = await ERPBenefitService.updateBenefit(benefitId, req.body, userId);
      ResponseUtil.success(res, 'Benefit updated successfully', benefit);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete benefit
   */
  static async deleteBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const benefitId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await ERPBenefitService.deleteBenefit(benefitId, userId);
      ResponseUtil.success(res, 'Benefit deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
