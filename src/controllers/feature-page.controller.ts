import { Request, Response, NextFunction } from "express";
import { FeaturePageService } from "../services/feature-page.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class FeaturePageController {
  /**
   * GET /api/feature-pages
   */
  static async listPublicPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const featureId = req.query.featureId ? parseInt(req.query.featureId as string) : undefined;
      const pages = await FeaturePageService.getPublicPages(locale, featureId);
      ResponseUtil.success(res, "Feature pages retrieved successfully", pages);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/feature-pages/:slug
   */
  static async getPublicPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug;
      const locale = req.locale || Locale.id;
      const page = await FeaturePageService.getPublicPageBySlug(slug, locale);
      ResponseUtil.success(res, "Feature page retrieved successfully", page);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/feature-pages/admin/all
   */
  static async listPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const featureId = req.query.featureId ? parseInt(req.query.featureId as string) : undefined;
      const isActive = req.query.isActive as string;

      const result = await FeaturePageService.getPages(page, limit, search, featureId, isActive);
      ResponseUtil.success(res, "Feature pages retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/feature-pages/admin/:id
   */
  static async getPageDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageId = parseInt(req.params.id);
      const detail = await FeaturePageService.getPageDetail(pageId);
      ResponseUtil.success(res, "Feature page detail retrieved successfully", detail);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/feature-pages/admin
   */
  static async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = await FeaturePageService.createPage(req.body, userId);
      ResponseUtil.created(res, "Feature page created successfully", page);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/feature-pages/admin/:id
   */
  static async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const page = await FeaturePageService.updatePage(pageId, req.body, userId);
      ResponseUtil.success(res, "Feature page updated successfully", page);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/feature-pages/admin/:id
   */
  static async deletePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await FeaturePageService.deletePage(pageId, userId);
      ResponseUtil.success(res, "Feature page deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/feature-pages/admin/:pageId/items
   */
  static async listItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageId = parseInt(req.params.pageId);
      const items = await FeaturePageService.listItems(pageId);
      ResponseUtil.success(res, "Feature page items retrieved successfully", items);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/feature-pages/admin/:pageId/items
   */
  static async createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageId = parseInt(req.params.pageId);
      const item = await FeaturePageService.createItem(pageId, req.body);
      ResponseUtil.created(res, "Feature page item created successfully", item);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/feature-pages/admin/items/:itemId
   */
  static async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itemId = parseInt(req.params.itemId);
      const item = await FeaturePageService.updateItem(itemId, req.body);
      ResponseUtil.success(res, "Feature page item updated successfully", item);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/feature-pages/admin/items/:itemId
   */
  static async deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itemId = parseInt(req.params.itemId);
      await FeaturePageService.deleteItem(itemId);
      ResponseUtil.success(res, "Feature page item deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
