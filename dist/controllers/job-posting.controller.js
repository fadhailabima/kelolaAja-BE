"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPostingController = void 0;
const job_posting_service_1 = require("../services/job-posting.service");
const jobPostingService = new job_posting_service_1.JobPostingService();
class JobPostingController {
    async create(req, res, next) {
        try {
            const data = req.body;
            const createdBy = req.user.userId;
            const job = await jobPostingService.createJobPosting(data, createdBy);
            res.status(201).json({
                success: true,
                message: "Job posting created successfully",
                data: job
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const jobId = parseInt(req.params.id);
            const data = req.body;
            const updatedBy = req.user.userId;
            const job = await jobPostingService.updateJobPosting(jobId, data, updatedBy);
            res.json({
                success: true,
                message: "Job posting updated successfully",
                data: job
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const locale = req.query.locale;
            const filters = {
                jobType: req.query.jobType,
                jobLevel: req.query.jobLevel,
                workLocation: req.query.workLocation,
                city: req.query.city,
                department: req.query.department,
                isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
                isFeatured: req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined,
                search: req.query.search
            };
            const result = await jobPostingService.getJobPostings(filters, locale, page, limit);
            res.json({
                success: true,
                message: "Job postings retrieved successfully",
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const jobId = parseInt(req.params.id);
            const locale = req.query.locale;
            const job = await jobPostingService.getJobPostingById(jobId, locale);
            if (!job) {
                res.status(404).json({
                    success: false,
                    message: "Job posting not found"
                });
                return;
            }
            res.json({
                success: true,
                message: "Job posting retrieved successfully",
                data: job
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBySlug(req, res, next) {
        try {
            const slug = req.params.slug;
            const locale = req.query.locale;
            const job = await jobPostingService.getJobPostingBySlug(slug, locale);
            if (!job) {
                res.status(404).json({
                    success: false,
                    message: "Job posting not found"
                });
                return;
            }
            res.json({
                success: true,
                message: "Job posting retrieved successfully",
                data: job
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const jobId = parseInt(req.params.id);
            await jobPostingService.deleteJobPosting(jobId);
            res.json({
                success: true,
                message: "Job posting deleted successfully"
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getStats(_req, res, next) {
        try {
            const stats = await jobPostingService.getJobStats();
            res.json({
                success: true,
                message: "Job statistics retrieved successfully",
                data: stats
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JobPostingController = JobPostingController;
//# sourceMappingURL=job-posting.controller.js.map