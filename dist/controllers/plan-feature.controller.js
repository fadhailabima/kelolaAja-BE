"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanFeatureController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const plan_feature_service_1 = require("../services/plan-feature.service");
class PlanFeatureController {
    static async getPlanFeatures(req, res, next) {
        try {
            const planId = parseInt(req.params.planId);
            const locale = req.locale || client_1.Locale.id;
            const features = await plan_feature_service_1.PlanFeatureService.getPlanFeatures(planId, locale);
            response_1.ResponseUtil.success(res, 'Plan features retrieved successfully', features);
        }
        catch (error) {
            next(error);
        }
    }
    static async addFeatureToPlan(req, res, next) {
        try {
            const result = await plan_feature_service_1.PlanFeatureService.addFeatureToPlan(req.body);
            response_1.ResponseUtil.created(res, 'Feature added to plan successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePlanFeature(req, res, next) {
        try {
            const listId = parseInt(req.params.id);
            const result = await plan_feature_service_1.PlanFeatureService.updatePlanFeature(listId, req.body);
            response_1.ResponseUtil.success(res, 'Plan feature updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async removeFeatureFromPlan(req, res, next) {
        try {
            const listId = parseInt(req.params.id);
            await plan_feature_service_1.PlanFeatureService.removeFeatureFromPlan(listId);
            response_1.ResponseUtil.success(res, 'Feature removed from plan successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async bulkAddFeatures(req, res, next) {
        try {
            const planId = parseInt(req.params.planId);
            const { features } = req.body;
            const result = await plan_feature_service_1.PlanFeatureService.bulkAddFeatures(planId, features);
            response_1.ResponseUtil.created(res, result.message, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlanFeatureController = PlanFeatureController;
//# sourceMappingURL=plan-feature.controller.js.map