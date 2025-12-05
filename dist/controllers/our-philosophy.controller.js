"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurPhilosophyController = void 0;
const our_philosophy_service_1 = require("../services/our-philosophy.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class OurPhilosophyController {
    static async listPublicPhilosophies(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const philosophies = await our_philosophy_service_1.OurPhilosophyService.getPublicPhilosophies(locale);
            response_1.ResponseUtil.success(res, "Our philosophies retrieved successfully", philosophies);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllPhilosophies(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.is_active;
            const result = await our_philosophy_service_1.OurPhilosophyService.getAllPhilosophies(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Our philosophies retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPhilosophy(req, res, next) {
        try {
            const userId = req.user.userId;
            const philosophy = await our_philosophy_service_1.OurPhilosophyService.createPhilosophy(req.body, userId);
            response_1.ResponseUtil.success(res, "Philosophy created successfully", philosophy, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePhilosophy(req, res, next) {
        try {
            const philosophyId = parseInt(req.params.id);
            const userId = req.user.userId;
            const philosophy = await our_philosophy_service_1.OurPhilosophyService.updatePhilosophy(philosophyId, req.body, userId);
            response_1.ResponseUtil.success(res, "Philosophy updated successfully", philosophy);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePhilosophy(req, res, next) {
        try {
            const philosophyId = parseInt(req.params.id);
            const userId = req.user.userId;
            await our_philosophy_service_1.OurPhilosophyService.deletePhilosophy(philosophyId, userId);
            response_1.ResponseUtil.success(res, "Philosophy deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OurPhilosophyController = OurPhilosophyController;
//# sourceMappingURL=our-philosophy.controller.js.map