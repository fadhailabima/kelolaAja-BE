import { Request, Response, NextFunction } from 'express';
import { ProcessStepService } from '../services/process-step.service';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';

export class ProcessStepController {
  /**
   * Get all active process steps (Public)
   */
  static async listPublicSteps(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.locale || Locale.id;
      const steps = await ProcessStepService.getPublicSteps(locale);
      ResponseUtil.success(res, 'Process steps retrieved successfully', steps);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all steps with all translations (Admin)
   */
  static async listAllSteps(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await ProcessStepService.getAllSteps(page, limit, search, isActive);
      ResponseUtil.success(res, 'Steps retrieved successfully', result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new step
   */
  static async createStep(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const step = await ProcessStepService.createStep(req.body, userId);
      ResponseUtil.success(res, 'Step created successfully', step, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update step
   */
  static async updateStep(req: Request, res: Response, next: NextFunction) {
    try {
      const stepId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const step = await ProcessStepService.updateStep(stepId, req.body, userId);
      ResponseUtil.success(res, 'Step updated successfully', step);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete step
   */
  static async deleteStep(req: Request, res: Response, next: NextFunction) {
    try {
      const stepId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await ProcessStepService.deleteStep(stepId, userId);
      ResponseUtil.success(res, 'Step deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
