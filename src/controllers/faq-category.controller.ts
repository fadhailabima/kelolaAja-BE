import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";
import { FAQCategoryService } from "../services/faq-category.service";

export class FAQCategoryController {
  /**
   * GET /api/faq-categories
   * Get all active FAQ categories (Public endpoint)
   */
  static async listPublicCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const categories = await FAQCategoryService.getPublicCategories(locale);
      ResponseUtil.success(res, "FAQ categories retrieved successfully", categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/faq-categories
   * Get all FAQ categories with all translations (Admin only)
   */
  static async listAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.isActive as string;

      const result = await FAQCategoryService.getAllCategories(page, limit, search, isActive);

      ResponseUtil.success(res, "FAQ categories retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/faq-categories
   * Create new FAQ category (Admin only)
   */
  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FAQCategoryService.createCategory(req.body, req.user!.userId);
      ResponseUtil.created(res, "FAQ category created successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/faq-categories/:id
   * Update FAQ category (Admin only)
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id);
      const result = await FAQCategoryService.updateCategory(categoryId, req.body, req.user!.userId);
      ResponseUtil.success(res, "FAQ category updated successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/faq-categories/:id
   * Soft delete FAQ category (Admin only)
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id);
      await FAQCategoryService.deleteCategory(categoryId, req.user!.userId);
      ResponseUtil.success(res, "FAQ category deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
