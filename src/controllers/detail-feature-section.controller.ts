import { Request, Response } from 'express';
import { DetailFeatureSectionService } from '../services/detail-feature-section.service';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';

export class DetailFeatureSectionController {
  /**
   * Get all active detail feature sections for public
   */
  static async listPublic(req: Request, res: Response) {
    try {
      const locale = (req.locale as Locale) || Locale.id;
      const category = req.query.category as string | undefined;

      const sections = await DetailFeatureSectionService.getPublicSections(locale, category);
      return ResponseUtil.success(res, 'Detail feature sections retrieved successfully', sections);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get all detail feature sections for admin (with pagination)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string | undefined;

      const result = await DetailFeatureSectionService.getAllSections(page, limit, category);
      return ResponseUtil.success(res, 'Detail feature sections retrieved successfully', result.data, 200, result.pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Create a new detail feature section
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const section = await DetailFeatureSectionService.createSection({
        ...req.body,
        createdBy: userId,
      });

      return ResponseUtil.success(res, 'Detail feature section created successfully', section, 201);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Update a detail feature section
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const sectionId = parseInt(req.params.id);
      const section = await DetailFeatureSectionService.updateSection(sectionId, {
        ...req.body,
        updatedBy: userId,
      });

      return ResponseUtil.success(res, 'Detail feature section updated successfully', section);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Delete a detail feature section
   */
  static async delete(req: Request, res: Response) {
    try {
      const sectionId = parseInt(req.params.id);
      const result = await DetailFeatureSectionService.deleteSection(sectionId);

      return ResponseUtil.success(res, result.message);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
