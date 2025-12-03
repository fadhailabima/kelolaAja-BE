"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const response_1 = require("../utils/response");
class AnalyticsController {
    static async trackVisitor(req, res, next) {
        try {
            const visitor = await analytics_service_1.AnalyticsService.trackVisitor(req.body);
            response_1.ResponseUtil.success(res, "Visitor tracked successfully", visitor);
        }
        catch (error) {
            next(error);
        }
    }
    static async trackPageView(req, res, next) {
        try {
            const pageView = await analytics_service_1.AnalyticsService.trackPageView(req.body);
            response_1.ResponseUtil.success(res, "Page view tracked successfully", pageView);
        }
        catch (error) {
            next(error);
        }
    }
    static async getOverview(req, res, next) {
        try {
            const rangeDays = req.query.rangeDays ? parseInt(req.query.rangeDays) : 7;
            const overview = await analytics_service_1.AnalyticsService.getOverview(rangeDays);
            response_1.ResponseUtil.success(res, "Analytics overview retrieved successfully", overview);
        }
        catch (error) {
            next(error);
        }
    }
    static async getVisitors(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const search = req.query.search;
            const result = await analytics_service_1.AnalyticsService.getVisitors(page, limit, search);
            response_1.ResponseUtil.success(res, "Visitors retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getVisitorDetail(req, res, next) {
        try {
            const visitorId = parseInt(req.params.id);
            const visitor = await analytics_service_1.AnalyticsService.getVisitorDetail(visitorId);
            response_1.ResponseUtil.success(res, "Visitor detail retrieved successfully", visitor);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPageViews(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const pagePath = req.query.pagePath;
            const visitorId = req.query.visitorId ? parseInt(req.query.visitorId) : undefined;
            const result = await analytics_service_1.AnalyticsService.getPageViews(page, limit, {
                pagePath,
                visitorId
            });
            response_1.ResponseUtil.success(res, "Page views retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTopPages(req, res, next) {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const limit = parseInt(req.query.limit) || 10;
            const topPages = await analytics_service_1.AnalyticsService.getTopPages(startDate, endDate, limit);
            response_1.ResponseUtil.success(res, "Top pages retrieved successfully", topPages);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map