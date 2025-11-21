"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const testimonial_service_1 = require("../services/testimonial.service");
class TestimonialController {
    static async listPublicTestimonials(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const isFeatured = req.query.featured === "true" ? true : undefined;
            const testimonials = await testimonial_service_1.TestimonialService.getPublicTestimonials(locale, isFeatured);
            response_1.ResponseUtil.success(res, "Testimonials retrieved successfully", testimonials);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicTestimonial(req, res, next) {
        try {
            const testimonialId = parseInt(req.params.id);
            const locale = req.locale || client_1.Locale.id;
            const testimonial = await testimonial_service_1.TestimonialService.getPublicTestimonialById(testimonialId, locale);
            response_1.ResponseUtil.success(res, "Testimonial retrieved successfully", testimonial);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllTestimonials(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isFeatured = req.query.featured;
            const isActive = req.query.isActive;
            const result = await testimonial_service_1.TestimonialService.getAllTestimonials(page, limit, search, isFeatured, isActive);
            response_1.ResponseUtil.success(res, "Testimonials retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createTestimonial(req, res, next) {
        try {
            const result = await testimonial_service_1.TestimonialService.createTestimonial(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, "Testimonial created successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTestimonial(req, res, next) {
        try {
            const testimonialId = parseInt(req.params.id);
            const result = await testimonial_service_1.TestimonialService.updateTestimonial(testimonialId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, "Testimonial updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteTestimonial(req, res, next) {
        try {
            const testimonialId = parseInt(req.params.id);
            await testimonial_service_1.TestimonialService.deleteTestimonial(testimonialId, req.user.userId);
            response_1.ResponseUtil.success(res, "Testimonial deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TestimonialController = TestimonialController;
//# sourceMappingURL=testimonial.controller.js.map