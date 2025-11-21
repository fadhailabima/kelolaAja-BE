"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailFeatureSectionController = void 0;
const detail_feature_section_service_1 = require("../services/detail-feature-section.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class DetailFeatureSectionController {
    static async listPublic(req, res) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const category = req.query.category;
            const sections = await detail_feature_section_service_1.DetailFeatureSectionService.getPublicSections(locale, category);
            return response_1.ResponseUtil.success(res, 'Detail feature sections retrieved successfully', sections);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category;
            const result = await detail_feature_section_service_1.DetailFeatureSectionService.getAllSections(page, limit, category);
            return response_1.ResponseUtil.success(res, 'Detail feature sections retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async create(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const section = await detail_feature_section_service_1.DetailFeatureSectionService.createSection({
                ...req.body,
                createdBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Detail feature section created successfully', section, 201);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async update(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const sectionId = parseInt(req.params.id);
            const section = await detail_feature_section_service_1.DetailFeatureSectionService.updateSection(sectionId, {
                ...req.body,
                updatedBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Detail feature section updated successfully', section);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const sectionId = parseInt(req.params.id);
            const result = await detail_feature_section_service_1.DetailFeatureSectionService.deleteSection(sectionId);
            return response_1.ResponseUtil.success(res, result.message);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.DetailFeatureSectionController = DetailFeatureSectionController;
//# sourceMappingURL=detail-feature-section.controller.js.map