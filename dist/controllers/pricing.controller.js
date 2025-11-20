"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const pricing_service_1 = require("../services/pricing.service");
class PricingController {
    static async listPublicPlans(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const plans = await pricing_service_1.PricingService.getPublicPlans(locale);
            response_1.ResponseUtil.success(res, 'Pricing plans retrieved successfully', plans);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicPlan(req, res, next) {
        try {
            const planId = parseInt(req.params.id);
            const locale = req.locale || client_1.Locale.id;
            const plan = await pricing_service_1.PricingService.getPublicPlanById(planId, locale);
            response_1.ResponseUtil.success(res, 'Pricing plan retrieved successfully', plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllPlans(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.isActive;
            const result = await pricing_service_1.PricingService.getAllPlans(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, 'Pricing plans retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPlan(req, res, next) {
        try {
            const result = await pricing_service_1.PricingService.createPlan(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, 'Pricing plan created successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePlan(req, res, next) {
        try {
            const planId = parseInt(req.params.id);
            const result = await pricing_service_1.PricingService.updatePlan(planId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, 'Pricing plan updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePlan(req, res, next) {
        try {
            const planId = parseInt(req.params.id);
            await pricing_service_1.PricingService.deletePlan(planId, req.user.userId);
            response_1.ResponseUtil.success(res, 'Pricing plan deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PricingController = PricingController;
//# sourceMappingURL=pricing.controller.js.map