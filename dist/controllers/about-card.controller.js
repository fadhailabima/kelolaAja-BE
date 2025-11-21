"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCardController = void 0;
const about_card_service_1 = require("../services/about-card.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class AboutCardController {
    static async listPublicCards(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const cards = await about_card_service_1.AboutCardService.getPublicCards(locale);
            response_1.ResponseUtil.success(res, "About cards retrieved successfully", cards);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllCards(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await about_card_service_1.AboutCardService.getAllCards(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Cards retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createCard(req, res, next) {
        try {
            const userId = req.user.userId;
            const card = await about_card_service_1.AboutCardService.createCard(req.body, userId);
            response_1.ResponseUtil.success(res, "Card created successfully", card, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCard(req, res, next) {
        try {
            const cardId = parseInt(req.params.id);
            const userId = req.user.userId;
            const card = await about_card_service_1.AboutCardService.updateCard(cardId, req.body, userId);
            response_1.ResponseUtil.success(res, "Card updated successfully", card);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCard(req, res, next) {
        try {
            const cardId = parseInt(req.params.id);
            const userId = req.user.userId;
            await about_card_service_1.AboutCardService.deleteCard(cardId, userId);
            response_1.ResponseUtil.success(res, "Card deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AboutCardController = AboutCardController;
//# sourceMappingURL=about-card.controller.js.map