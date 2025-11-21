"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStepController = void 0;
const process_step_service_1 = require("../services/process-step.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class ProcessStepController {
    static async listPublicSteps(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const steps = await process_step_service_1.ProcessStepService.getPublicSteps(locale);
            response_1.ResponseUtil.success(res, "Process steps retrieved successfully", steps);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllSteps(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await process_step_service_1.ProcessStepService.getAllSteps(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Steps retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createStep(req, res, next) {
        try {
            const userId = req.user.userId;
            const step = await process_step_service_1.ProcessStepService.createStep(req.body, userId);
            response_1.ResponseUtil.success(res, "Step created successfully", step, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStep(req, res, next) {
        try {
            const stepId = parseInt(req.params.id);
            const userId = req.user.userId;
            const step = await process_step_service_1.ProcessStepService.updateStep(stepId, req.body, userId);
            response_1.ResponseUtil.success(res, "Step updated successfully", step);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteStep(req, res, next) {
        try {
            const stepId = parseInt(req.params.id);
            const userId = req.user.userId;
            await process_step_service_1.ProcessStepService.deleteStep(stepId, userId);
            response_1.ResponseUtil.success(res, "Step deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProcessStepController = ProcessStepController;
//# sourceMappingURL=process-step.controller.js.map