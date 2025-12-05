"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreValueController = void 0;
const core_value_service_1 = require("../services/core-value.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class CoreValueController {
    static async listPublicValues(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const values = await core_value_service_1.CoreValueService.getPublicValues(locale);
            response_1.ResponseUtil.success(res, "Core values retrieved successfully", values);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllValues(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await core_value_service_1.CoreValueService.getAllValues(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Core values retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createValue(req, res, next) {
        try {
            const userId = req.user.userId;
            const value = await core_value_service_1.CoreValueService.createValue(req.body, userId);
            response_1.ResponseUtil.success(res, "Core value created successfully", value, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateValue(req, res, next) {
        try {
            const valueId = parseInt(req.params.id);
            const userId = req.user.userId;
            const value = await core_value_service_1.CoreValueService.updateValue(valueId, req.body, userId);
            response_1.ResponseUtil.success(res, "Core value updated successfully", value);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteValue(req, res, next) {
        try {
            const valueId = parseInt(req.params.id);
            const userId = req.user.userId;
            await core_value_service_1.CoreValueService.deleteValue(valueId, userId);
            response_1.ResponseUtil.success(res, "Core value deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CoreValueController = CoreValueController;
//# sourceMappingURL=core-value.controller.js.map