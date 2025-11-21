"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KelolaAjaFeatureController = void 0;
const kelolaaja_feature_service_1 = require("../services/kelolaaja-feature.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class KelolaAjaFeatureController {
    static async listPublicFeatures(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const features = await kelolaaja_feature_service_1.KelolaAjaFeatureService.getPublicFeatures(locale);
            response_1.ResponseUtil.success(res, "KelolaAja features retrieved successfully", features);
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
            const isActive = req.query.is_active;
            const result = await kelolaaja_feature_service_1.KelolaAjaFeatureService.getAllFeatures(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Features retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createFeature(req, res, next) {
        try {
            const userId = req.user.userId;
            const feature = await kelolaaja_feature_service_1.KelolaAjaFeatureService.createFeature(req.body, userId);
            response_1.ResponseUtil.success(res, "Feature created successfully", feature, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFeature(req, res, next) {
        try {
            const featureId = parseInt(req.params.id);
            const userId = req.user.userId;
            const feature = await kelolaaja_feature_service_1.KelolaAjaFeatureService.updateFeature(featureId, req.body, userId);
            response_1.ResponseUtil.success(res, "Feature updated successfully", feature);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFeature(req, res, next) {
        try {
            const featureId = parseInt(req.params.id);
            const userId = req.user.userId;
            await kelolaaja_feature_service_1.KelolaAjaFeatureService.deleteFeature(featureId, userId);
            response_1.ResponseUtil.success(res, "Feature deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.KelolaAjaFeatureController = KelolaAjaFeatureController;
//# sourceMappingURL=kelolaaja-feature.controller.js.map