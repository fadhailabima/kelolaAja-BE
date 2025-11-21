"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const faq_service_1 = require("../services/faq.service");
class FAQController {
    static async listPublicFAQs(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
            const faqs = await faq_service_1.FAQService.getPublicFAQs(locale, categoryId);
            response_1.ResponseUtil.success(res, "FAQs retrieved successfully", faqs);
        }
        catch (error) {
            next(error);
        }
    }
    static async listPublicFAQsByCategory(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const faqs = await faq_service_1.FAQService.getPublicFAQsByCategory(locale);
            response_1.ResponseUtil.success(res, "FAQs by category retrieved successfully", faqs);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicFAQ(req, res, next) {
        try {
            const faqId = parseInt(req.params.id);
            const locale = req.locale || client_1.Locale.id;
            const faq = await faq_service_1.FAQService.getPublicFAQById(faqId, locale);
            response_1.ResponseUtil.success(res, "FAQ retrieved successfully", faq);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllFAQs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
            const isActive = req.query.isActive;
            const result = await faq_service_1.FAQService.getAllFAQs(page, limit, search, categoryId, isActive);
            response_1.ResponseUtil.success(res, "FAQs retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createFAQ(req, res, next) {
        try {
            const result = await faq_service_1.FAQService.createFAQ(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, "FAQ created successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFAQ(req, res, next) {
        try {
            const faqId = parseInt(req.params.id);
            const result = await faq_service_1.FAQService.updateFAQ(faqId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, "FAQ updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFAQ(req, res, next) {
        try {
            const faqId = parseInt(req.params.id);
            await faq_service_1.FAQService.deleteFAQ(faqId, req.user.userId);
            response_1.ResponseUtil.success(res, "FAQ deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FAQController = FAQController;
//# sourceMappingURL=faq.controller.js.map