"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQCategoryController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const faq_category_service_1 = require("../services/faq-category.service");
class FAQCategoryController {
    static async listPublicCategories(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const categories = await faq_category_service_1.FAQCategoryService.getPublicCategories(locale);
            response_1.ResponseUtil.success(res, 'FAQ categories retrieved successfully', categories);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllCategories(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.isActive;
            const result = await faq_category_service_1.FAQCategoryService.getAllCategories(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, 'FAQ categories retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const result = await faq_category_service_1.FAQCategoryService.createCategory(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, 'FAQ category created successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const categoryId = parseInt(req.params.id);
            const result = await faq_category_service_1.FAQCategoryService.updateCategory(categoryId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, 'FAQ category updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const categoryId = parseInt(req.params.id);
            await faq_category_service_1.FAQCategoryService.deleteCategory(categoryId, req.user.userId);
            response_1.ResponseUtil.success(res, 'FAQ category deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FAQCategoryController = FAQCategoryController;
//# sourceMappingURL=faq-category.controller.js.map