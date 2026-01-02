import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";
import { FAQService } from "../services/faq.service";

export class FAQController {
  /**
   * GET /api/faqs
   * Get all active FAQs (Public endpoint)
   */
  static async listPublicFAQs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

      const faqs = await FAQService.getPublicFAQs(locale, categoryId);
      ResponseUtil.success(res, "FAQs retrieved successfully", faqs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/faqs/by-category
   * Get FAQs grouped by category (Public endpoint)
   */
  static async listPublicFAQsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const faqs = await FAQService.getPublicFAQsByCategory(locale);
      ResponseUtil.success(res, "FAQs by category retrieved successfully", faqs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/faqs/:id
   * Get single FAQ by ID (Public endpoint)
   */
  static async getPublicFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqId = parseInt(req.params.id);
      const locale = req.locale || Locale.id;

      const faq = await FAQService.getPublicFAQById(faqId, locale);
      ResponseUtil.success(res, "FAQ retrieved successfully", faq);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/faqs
   * Get all FAQs with all translations (Admin only)
   */
  static async listAllFAQs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const isActive = req.query.isActive as string;

      const result = await FAQService.getAllFAQs(page, limit, search, categoryId, isActive);

      ResponseUtil.success(res, "FAQs retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/faqs
   * Create new FAQ (Admin only)
   */
  static async createFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FAQService.createFAQ(req.body, req.user!.userId);
      ResponseUtil.created(res, "FAQ created successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/faqs/:id
   * Update FAQ (Admin only)
   */
  static async updateFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqId = parseInt(req.params.id);
      const result = await FAQService.updateFAQ(faqId, req.body, req.user!.userId);
      ResponseUtil.success(res, "FAQ updated successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/faqs/:id
   * Soft delete FAQ (Admin only)
   */
  static async deleteFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqId = parseInt(req.params.id);
      await FAQService.deleteFAQ(faqId, req.user!.userId);
      ResponseUtil.success(res, "FAQ deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
