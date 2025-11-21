"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSubmissionController = void 0;
const contact_submission_service_1 = require("../services/contact-submission.service");
const response_1 = require("../utils/response");
class ContactSubmissionController {
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const filters = {
                status: req.query.status,
                assignedTo: req.query.assignedTo ? parseInt(req.query.assignedTo) : undefined,
                source: req.query.source
            };
            const result = await contact_submission_service_1.ContactSubmissionService.getAllSubmissions(page, limit, filters);
            const { data, pagination } = result;
            return response_1.ResponseUtil.success(res, "Contact submissions retrieved successfully", data, 200, pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async getById(req, res) {
        try {
            const submissionId = parseInt(req.params.id);
            const submission = await contact_submission_service_1.ContactSubmissionService.getSubmissionById(submissionId);
            return response_1.ResponseUtil.success(res, "Contact submission retrieved successfully", submission);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async create(req, res) {
        try {
            const submission = await contact_submission_service_1.ContactSubmissionService.createSubmission(req.body);
            return response_1.ResponseUtil.success(res, "Contact submission created successfully", submission, 201);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async update(req, res) {
        try {
            const submissionId = parseInt(req.params.id);
            const submission = await contact_submission_service_1.ContactSubmissionService.updateSubmission(submissionId, req.body);
            return response_1.ResponseUtil.success(res, "Contact submission updated successfully", submission);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async assign(req, res) {
        try {
            const submissionId = parseInt(req.params.id);
            const { assignedTo } = req.body;
            if (!assignedTo) {
                return response_1.ResponseUtil.error(res, "assignedTo is required", null, 400);
            }
            const submission = await contact_submission_service_1.ContactSubmissionService.assignSubmission(submissionId, assignedTo);
            return response_1.ResponseUtil.success(res, "Contact submission assigned successfully", submission);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async delete(req, res) {
        try {
            const submissionId = parseInt(req.params.id);
            const result = await contact_submission_service_1.ContactSubmissionService.deleteSubmission(submissionId);
            return response_1.ResponseUtil.success(res, result.message);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
    static async getStats(_req, res) {
        try {
            const stats = await contact_submission_service_1.ContactSubmissionService.getSubmissionStats();
            return response_1.ResponseUtil.success(res, "Submission statistics retrieved successfully", stats);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
        }
    }
}
exports.ContactSubmissionController = ContactSubmissionController;
//# sourceMappingURL=contact-submission.controller.js.map