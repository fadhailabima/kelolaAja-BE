"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERPBenefitController = void 0;
const erp_benefit_service_1 = require("../services/erp-benefit.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class ERPBenefitController {
    static async listPublicBenefits(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const benefits = await erp_benefit_service_1.ERPBenefitService.getPublicBenefits(locale);
            response_1.ResponseUtil.success(res, 'ERP benefits retrieved successfully', benefits);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllBenefits(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await erp_benefit_service_1.ERPBenefitService.getAllBenefits(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, 'Benefits retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createBenefit(req, res, next) {
        try {
            const userId = req.user.userId;
            const benefit = await erp_benefit_service_1.ERPBenefitService.createBenefit(req.body, userId);
            response_1.ResponseUtil.success(res, 'Benefit created successfully', benefit, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateBenefit(req, res, next) {
        try {
            const benefitId = parseInt(req.params.id);
            const userId = req.user.userId;
            const benefit = await erp_benefit_service_1.ERPBenefitService.updateBenefit(benefitId, req.body, userId);
            response_1.ResponseUtil.success(res, 'Benefit updated successfully', benefit);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteBenefit(req, res, next) {
        try {
            const benefitId = parseInt(req.params.id);
            const userId = req.user.userId;
            await erp_benefit_service_1.ERPBenefitService.deleteBenefit(benefitId, userId);
            response_1.ResponseUtil.success(res, 'Benefit deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ERPBenefitController = ERPBenefitController;
//# sourceMappingURL=erp-benefit.controller.js.map