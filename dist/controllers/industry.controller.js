"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustryController = void 0;
const industry_service_1 = require("../services/industry.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
class IndustryController {
    static async listPublicIndustries(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const industries = await industry_service_1.IndustryService.getPublicIndustries(locale);
            response_1.ResponseUtil.success(res, "Industries retrieved successfully", industries);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicIndustry(req, res, next) {
        try {
            const slug = req.params.slug;
            const locale = req.locale || client_1.Locale.id;
            const industry = await industry_service_1.IndustryService.getPublicIndustryBySlug(slug, locale);
            response_1.ResponseUtil.success(res, "Industry retrieved successfully", industry);
        }
        catch (error) {
            next(error);
        }
    }
    static async listIndustries(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.isActive;
            const result = await industry_service_1.IndustryService.getIndustries(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, "Industries retrieved successfully", result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getIndustryDetail(req, res, next) {
        try {
            const industryId = parseInt(req.params.id);
            const industry = await industry_service_1.IndustryService.getIndustryDetail(industryId);
            response_1.ResponseUtil.success(res, "Industry detail retrieved successfully", industry);
        }
        catch (error) {
            next(error);
        }
    }
    static async createIndustry(req, res, next) {
        try {
            const userId = req.user.userId;
            const industry = await industry_service_1.IndustryService.createIndustry(req.body, userId);
            response_1.ResponseUtil.created(res, "Industry created successfully", industry);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateIndustry(req, res, next) {
        try {
            const industryId = parseInt(req.params.id);
            const userId = req.user.userId;
            const industry = await industry_service_1.IndustryService.updateIndustry(industryId, req.body, userId);
            response_1.ResponseUtil.success(res, "Industry updated successfully", industry);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteIndustry(req, res, next) {
        try {
            const industryId = parseInt(req.params.id);
            const userId = req.user.userId;
            await industry_service_1.IndustryService.deleteIndustry(industryId, userId);
            response_1.ResponseUtil.success(res, "Industry deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async listProblems(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const problems = await industry_service_1.IndustryService.listProblems(industryId);
            response_1.ResponseUtil.success(res, "Industry problems retrieved successfully", problems);
        }
        catch (error) {
            next(error);
        }
    }
    static async createProblem(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const problem = await industry_service_1.IndustryService.createProblem(industryId, req.body);
            response_1.ResponseUtil.created(res, "Industry problem created successfully", problem);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProblem(req, res, next) {
        try {
            const problemId = parseInt(req.params.problemId);
            const problem = await industry_service_1.IndustryService.updateProblem(problemId, req.body);
            response_1.ResponseUtil.success(res, "Industry problem updated successfully", problem);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProblem(req, res, next) {
        try {
            const problemId = parseInt(req.params.problemId);
            await industry_service_1.IndustryService.deleteProblem(problemId);
            response_1.ResponseUtil.success(res, "Industry problem deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async listSolutions(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const solutions = await industry_service_1.IndustryService.listSolutions(industryId);
            response_1.ResponseUtil.success(res, "Industry solutions retrieved successfully", solutions);
        }
        catch (error) {
            next(error);
        }
    }
    static async createSolution(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const solution = await industry_service_1.IndustryService.createSolution(industryId, req.body);
            response_1.ResponseUtil.created(res, "Industry solution created successfully", solution);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSolution(req, res, next) {
        try {
            const solutionId = parseInt(req.params.solutionId);
            const solution = await industry_service_1.IndustryService.updateSolution(solutionId, req.body);
            response_1.ResponseUtil.success(res, "Industry solution updated successfully", solution);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteSolution(req, res, next) {
        try {
            const solutionId = parseInt(req.params.solutionId);
            await industry_service_1.IndustryService.deleteSolution(solutionId);
            response_1.ResponseUtil.success(res, "Industry solution deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async listMedia(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const media = await industry_service_1.IndustryService.listMedia(industryId);
            response_1.ResponseUtil.success(res, "Industry media retrieved successfully", media);
        }
        catch (error) {
            next(error);
        }
    }
    static async addMedia(req, res, next) {
        try {
            const industryId = parseInt(req.params.industryId);
            const media = await industry_service_1.IndustryService.addMedia(industryId, req.body);
            response_1.ResponseUtil.created(res, "Industry media added successfully", media);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateMedia(req, res, next) {
        try {
            const mediaId = parseInt(req.params.mediaId);
            const media = await industry_service_1.IndustryService.updateMedia(mediaId, req.body);
            response_1.ResponseUtil.success(res, "Industry media updated successfully", media);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteMedia(req, res, next) {
        try {
            const mediaId = parseInt(req.params.mediaId);
            await industry_service_1.IndustryService.deleteMedia(mediaId);
            response_1.ResponseUtil.success(res, "Industry media deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IndustryController = IndustryController;
//# sourceMappingURL=industry.controller.js.map