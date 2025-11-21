import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";
import { PartnerService } from "../services/partner.service";

export class PartnerController {
  /**
   * GET /api/partners
   * Get all active partners (Public endpoint)
   */
  static async listPublicPartners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const partners = await PartnerService.getPublicPartners(locale);
      ResponseUtil.success(res, "Partners retrieved successfully", partners);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/partners
   * Get all partners with all translations (Admin only)
   */
  static async listAllPartners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.isActive as string;

      const result = await PartnerService.getAllPartners(page, limit, search, isActive);

      ResponseUtil.success(res, "Partners retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/partners
   * Create new partner (Admin only)
   */
  static async createPartner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PartnerService.createPartner(req.body, req.user!.userId);
      ResponseUtil.created(res, "Partner created successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/partners/:id
   * Update partner (Admin only)
   */
  static async updatePartner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partnerId = parseInt(req.params.id);
      const result = await PartnerService.updatePartner(partnerId, req.body, req.user!.userId);
      ResponseUtil.success(res, "Partner updated successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/partners/:id
   * Soft delete partner (Admin only)
   */
  static async deletePartner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partnerId = parseInt(req.params.id);
      await PartnerService.deletePartner(partnerId, req.user!.userId);
      ResponseUtil.success(res, "Partner deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
