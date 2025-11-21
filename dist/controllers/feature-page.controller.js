"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturePageController = void 0;
const feature_page_service_1 = require("../services/feature-page.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class FeaturePageController {
    static async listPublicPages(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const featureId = req.query.featureId ? parseInt(req.query.featureId) : undefined;
            const pages = await feature_page_service_1.FeaturePageService.getPublicPages(locale, featureId);
            response_1.ResponseUtil.success(res, "Feature pages retrieved successfully", pages);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicPage(req, res, next) {
        try {
            const slug = req.params.slug;
            const locale = req.locale || client_1.Locale.id;
            const page = await feature_page_service_1.FeaturePageService.getPublicPageBySlug(slug, locale);
            response_1.ResponseUtil.success(res, "Feature page retrieved successfully", page);
        }
        catch (error) {
            next(error);
        }
    }
    static async listPages(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const featureId = req.query.featureId ? parseInt(req.query.featureId) : undefined;
            const isActive = req.query.isActive;
            const result = await feature_page_service_1.FeaturePageService.getPages(page, limit, search, featureId, isActive);
            response_1.ResponseUtil.success(res, "Feature pages retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPageDetail(req, res, next) {
        try {
            const pageId = parseInt(req.params.id);
            const detail = await feature_page_service_1.FeaturePageService.getPageDetail(pageId);
            response_1.ResponseUtil.success(res, "Feature page detail retrieved successfully", detail);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPage(req, res, next) {
        try {
            const userId = req.user.userId;
            const page = await feature_page_service_1.FeaturePageService.createPage(req.body, userId);
            response_1.ResponseUtil.created(res, "Feature page created successfully", page);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePage(req, res, next) {
        try {
            const pageId = parseInt(req.params.id);
            const userId = req.user.userId;
            const page = await feature_page_service_1.FeaturePageService.updatePage(pageId, req.body, userId);
            response_1.ResponseUtil.success(res, "Feature page updated successfully", page);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePage(req, res, next) {
        try {
            const pageId = parseInt(req.params.id);
            const userId = req.user.userId;
            await feature_page_service_1.FeaturePageService.deletePage(pageId, userId);
            response_1.ResponseUtil.success(res, "Feature page deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async listItems(req, res, next) {
        try {
            const pageId = parseInt(req.params.pageId);
            const items = await feature_page_service_1.FeaturePageService.listItems(pageId);
            response_1.ResponseUtil.success(res, "Feature page items retrieved successfully", items);
        }
        catch (error) {
            next(error);
        }
    }
    static async createItem(req, res, next) {
        try {
            const pageId = parseInt(req.params.pageId);
            const item = await feature_page_service_1.FeaturePageService.createItem(pageId, req.body);
            response_1.ResponseUtil.created(res, "Feature page item created successfully", item);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateItem(req, res, next) {
        try {
            const itemId = parseInt(req.params.itemId);
            const item = await feature_page_service_1.FeaturePageService.updateItem(itemId, req.body);
            response_1.ResponseUtil.success(res, "Feature page item updated successfully", item);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteItem(req, res, next) {
        try {
            const itemId = parseInt(req.params.itemId);
            await feature_page_service_1.FeaturePageService.deleteItem(itemId);
            response_1.ResponseUtil.success(res, "Feature page item deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeaturePageController = FeaturePageController;
//# sourceMappingURL=feature-page.controller.js.map