import { Request, Response, NextFunction } from "express";
import { AboutCardService } from "../services/about-card.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class AboutCardController {
  /**
   * Get all active about cards (Public)
   */
  static async listPublicCards(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const locale = req.locale || Locale.id;
      const cards = await AboutCardService.getPublicCards(locale);

      // Set cache-control headers to ensure fresh data
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      ResponseUtil.success(res, "About cards retrieved successfully", cards);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all cards with all translations (Admin)
   */
  static async listAllCards(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.is_active as string;

      const result = await AboutCardService.getAllCards(
        page,
        limit,
        search,
        isActive
      );
      ResponseUtil.success(
        res,
        "Cards retrieved successfully",
        result.data,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new card
   */
  static async createCard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const card = await AboutCardService.createCard(req.body, userId);
      ResponseUtil.success(res, "Card created successfully", card, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update card
   */
  static async updateCard(req: Request, res: Response, next: NextFunction) {
    try {
      const cardId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const card = await AboutCardService.updateCard(cardId, req.body, userId);
      ResponseUtil.success(res, "Card updated successfully", card);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete card
   */
  static async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const cardId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await AboutCardService.deleteCard(cardId, userId);
      ResponseUtil.success(res, "Card deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
