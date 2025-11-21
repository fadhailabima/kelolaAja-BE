"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenefitStatController = void 0;
const benefit_stat_service_1 = require("../services/benefit-stat.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class BenefitStatController {
    static async listPublicStats(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const stats = await benefit_stat_service_1.BenefitStatService.getPublicStats(locale);
            response_1.ResponseUtil.success(res, "Benefit stats retrieved successfully", stats);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllStats(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await benefit_stat_service_1.BenefitStatService.getAllStats(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Stats retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createStat(req, res, next) {
        try {
            const userId = req.user.userId;
            const stat = await benefit_stat_service_1.BenefitStatService.createStat(req.body, userId);
            response_1.ResponseUtil.success(res, "Stat created successfully", stat, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStat(req, res, next) {
        try {
            const statId = parseInt(req.params.id);
            const userId = req.user.userId;
            const stat = await benefit_stat_service_1.BenefitStatService.updateStat(statId, req.body, userId);
            response_1.ResponseUtil.success(res, "Stat updated successfully", stat);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteStat(req, res, next) {
        try {
            const statId = parseInt(req.params.id);
            const userId = req.user.userId;
            await benefit_stat_service_1.BenefitStatService.deleteStat(statId, userId);
            response_1.ResponseUtil.success(res, "Stat deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BenefitStatController = BenefitStatController;
//# sourceMappingURL=benefit-stat.controller.js.map