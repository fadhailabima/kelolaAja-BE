import { Request, Response } from 'express';
import { ContentSectionService } from '../services/content-section.service';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';

export class ContentSectionController {
  /**
   * Get all active content sections for public
   */
  static async listPublic(req: Request, res: Response) {
    try {
      const locale = (req.locale as Locale) || Locale.id;
      const pageLocation = req.query.pageLocation as string | undefined;

      const sections = await ContentSectionService.getPublicSections(locale, pageLocation);
      return ResponseUtil.success(res, 'Content sections retrieved successfully', sections);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get a specific content section by key
   */
  static async getByKey(req: Request, res: Response) {
    try {
      const locale = (req.locale as Locale) || Locale.id;
      const sectionKey = req.params.key;

      const section = await ContentSectionService.getPublicSectionByKey(sectionKey, locale);
      return ResponseUtil.success(res, 'Content section retrieved successfully', section);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get all content sections for admin (with pagination)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const pageLocation = req.query.pageLocation as string | undefined;

      const result = await ContentSectionService.getAllSections(page, limit, pageLocation);
      return ResponseUtil.success(res, 'Content sections retrieved successfully', result.data, 200, result.pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Create a new content section
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const section = await ContentSectionService.createSection({
        ...req.body,
        createdBy: userId,
      });

      return ResponseUtil.success(res, 'Content section created successfully', section, 201);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Update a content section
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const sectionId = parseInt(req.params.id);
      const section = await ContentSectionService.updateSection(sectionId, {
        ...req.body,
        updatedBy: userId,
      });

      return ResponseUtil.success(res, 'Content section updated successfully', section);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Delete a content section
   */
  static async delete(req: Request, res: Response) {
    try {
      const sectionId = parseInt(req.params.id);
      const result = await ContentSectionService.deleteSection(sectionId);

      return ResponseUtil.success(res, result.message);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
