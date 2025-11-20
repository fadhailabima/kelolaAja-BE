import { Request, Response, NextFunction } from 'express';
import { BenefitStatService } from '../services/benefit-stat.service';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';

export class BenefitStatController {
  /**
   * Get all active benefit stats (Public)
   */
  static async listPublicStats(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const stats = await BenefitStatService.getPublicStats(locale);
      ResponseUtil.success(res, 'Benefit stats retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all stats with all translations (Admin)
   */
  static async listAllStats(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await BenefitStatService.getAllStats(page, limit, search, isActive);
      ResponseUtil.success(res, 'Stats retrieved successfully', result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new stat
   */
  static async createStat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const stat = await BenefitStatService.createStat(req.body, userId);
      ResponseUtil.success(res, 'Stat created successfully', stat, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update stat
   */
  static async updateStat(req: Request, res: Response, next: NextFunction) {
    try {
      const statId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const stat = await BenefitStatService.updateStat(statId, req.body, userId);
      ResponseUtil.success(res, 'Stat updated successfully', stat);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete stat
   */
  static async deleteStat(req: Request, res: Response, next: NextFunction) {
    try {
      const statId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await BenefitStatService.deleteStat(statId, userId);
      ResponseUtil.success(res, 'Stat deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
