"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const feature_service_1 = require("../services/feature.service");
class FeatureController {
    static async listPublicFeatures(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const category = req.query.category;
            const features = await feature_service_1.FeatureService.getPublicFeatures(locale, category);
            response_1.ResponseUtil.success(res, "Features retrieved successfully", features);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicFeature(req, res, next) {
        try {
            const featureId = parseInt(req.params.id);
            const locale = req.locale || client_1.Locale.id;
            const feature = await feature_service_1.FeatureService.getPublicFeatureById(featureId, locale);
            response_1.ResponseUtil.success(res, "Feature retrieved successfully", feature);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategories(_req, res, next) {
        try {
            const categories = await feature_service_1.FeatureService.getCategories();
            response_1.ResponseUtil.success(res, "Categories retrieved successfully", categories);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllFeatures(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const category = req.query.category;
            const isActive = req.query.isActive;
            const result = await feature_service_1.FeatureService.getAllFeatures(page, limit, search, category, isActive);
            response_1.ResponseUtil.success(res, "Features retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createFeature(req, res, next) {
        try {
            const result = await feature_service_1.FeatureService.createFeature(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, "Feature created successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFeature(req, res, next) {
        try {
            const featureId = parseInt(req.params.id);
            const result = await feature_service_1.FeatureService.updateFeature(featureId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, "Feature updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFeature(req, res, next) {
        try {
            const featureId = parseInt(req.params.id);
            await feature_service_1.FeatureService.deleteFeature(featureId, req.user.userId);
            response_1.ResponseUtil.success(res, "Feature deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeatureController = FeatureController;
//# sourceMappingURL=feature.controller.js.map