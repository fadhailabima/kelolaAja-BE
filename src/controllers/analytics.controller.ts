import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { ResponseUtil } from "../utils/response";

export class AnalyticsController {
  /**
   * POST /api/analytics/visitors
   */
  static async trackVisitor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visitor = await AnalyticsService.trackVisitor(req.body);
      ResponseUtil.success(res, "Visitor tracked successfully", visitor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/analytics/page-views
   */
  static async trackPageView(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageView = await AnalyticsService.trackPageView(req.body);
      ResponseUtil.success(res, "Page view tracked successfully", pageView);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/admin/overview
   */
  static async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rangeDays = req.query.rangeDays ? parseInt(req.query.rangeDays as string) : 7;
      const overview = await AnalyticsService.getOverview(rangeDays);
      ResponseUtil.success(res, "Analytics overview retrieved successfully", overview);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/admin/visitors
   */
  static async getVisitors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const result = await AnalyticsService.getVisitors(page, limit, search);
      ResponseUtil.success(res, "Visitors retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/admin/visitors/:id
   */
  static async getVisitorDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visitorId = parseInt(req.params.id);
      const visitor = await AnalyticsService.getVisitorDetail(visitorId);
      ResponseUtil.success(res, "Visitor detail retrieved successfully", visitor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/admin/page-views
   */
  static async getPageViews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const pagePath = req.query.pagePath as string;
      const visitorId = req.query.visitorId ? parseInt(req.query.visitorId as string) : undefined;

      const result = await AnalyticsService.getPageViews(page, limit, {
        pagePath,
        visitorId
      });

      ResponseUtil.success(res, "Page views retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }
}
