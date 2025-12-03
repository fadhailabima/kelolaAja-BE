"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSectionController = void 0;
const content_section_service_1 = require("../services/content-section.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class ContentSectionController {
    static async listPublic(req, res) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const pageLocation = req.query.pageLocation;
            const sections = await content_section_service_1.ContentSectionService.getPublicSections(locale, pageLocation);
            return response_1.ResponseUtil.success(res, 'Content sections retrieved successfully', sections);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getByKey(req, res) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const sectionKey = req.params.key;
            const section = await content_section_service_1.ContentSectionService.getPublicSectionByKey(sectionKey, locale);
            return response_1.ResponseUtil.success(res, 'Content section retrieved successfully', section);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pageLocation = req.query.pageLocation;
            const result = await content_section_service_1.ContentSectionService.getAllSections(page, limit, pageLocation);
            return response_1.ResponseUtil.success(res, 'Content sections retrieved successfully', result.data, 200, result.pagination);
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
            const section = await content_section_service_1.ContentSectionService.createSection({
                sectionType: req.body.sectionType,
                sectionKey: req.body.sectionKey,
                pageLocation: req.body.pageLocation,
                displayOrder: parseInt(req.body.displayOrder),
                isActive: req.body.isActive === 'true' || req.body.isActive === true,
                metadata: req.body.metadata,
                translations: req.body.translations,
                createdBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Content section created successfully', section, 201);
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
            const section = await content_section_service_1.ContentSectionService.updateSection(sectionId, {
                pageLocation: req.body.pageLocation,
                displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder) : undefined,
                isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : undefined,
                metadata: req.body.metadata,
                translations: req.body.translations,
                updatedBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Content section updated successfully', section);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const sectionId = parseInt(req.params.id);
            const result = await content_section_service_1.ContentSectionService.deleteSection(sectionId);
            return response_1.ResponseUtil.success(res, result.message);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.ContentSectionController = ContentSectionController;
//# sourceMappingURL=content-section.controller.js.map