"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationController = void 0;
const job_application_service_1 = require("../services/job-application.service");
const jobApplicationService = new job_application_service_1.JobApplicationService();
class JobApplicationController {
    async create(req, res, next) {
        try {
            let cvFileId;
            if (req.file) {
                const { FileUtil } = await Promise.resolve().then(() => __importStar(require("../utils/file.util")));
                const { MediaFileService } = await Promise.resolve().then(() => __importStar(require("../services/media-file.service")));
                const fileType = FileUtil.getFileType(req.file.mimetype);
                const mediaFile = await MediaFileService.createFile({
                    fileName: req.file.originalname,
                    filePath: req.file.path.replace(/\\/g, "/"),
                    fileType,
                    mimeType: req.file.mimetype,
                    fileSize: BigInt(req.file.size),
                    altText: `CV - ${req.body.applicantName}`,
                    storageType: "local",
                    isPublic: false,
                    uploadedBy: req.user?.userId,
                });
                cvFileId = mediaFile.fileId;
            }
            const data = {
                jobId: parseInt(req.body.jobId),
                applicantName: req.body.applicantName,
                applicantEmail: req.body.applicantEmail,
                applicantPhone: req.body.applicantPhone,
                currentCompany: req.body.currentCompany,
                currentPosition: req.body.currentPosition,
                yearsOfExperience: req.body.yearsOfExperience ? parseInt(req.body.yearsOfExperience) : undefined,
                expectedSalary: req.body.expectedSalary ? parseInt(req.body.expectedSalary) : undefined,
                salaryCurrency: req.body.salaryCurrency,
                availableFrom: req.body.availableFrom ? new Date(req.body.availableFrom) : undefined,
                coverLetter: req.body.coverLetter,
                cvFileId: cvFileId || (req.body.cvFileId ? parseInt(req.body.cvFileId) : undefined),
                portfolioUrl: req.body.portfolioUrl,
                linkedinUrl: req.body.linkedinUrl,
                githubUrl: req.body.githubUrl,
                referralSource: req.body.referralSource,
            };
            const ipAddress = req.ip;
            const userAgent = req.get("user-agent");
            const application = await jobApplicationService.createJobApplication(data, ipAddress, userAgent);
            res.status(201).json({
                success: true,
                message: "Application submitted successfully",
                data: application,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const applicationId = parseInt(req.params.id);
            const data = {
                status: req.body.status,
                rating: req.body.rating ? parseInt(req.body.rating) : undefined,
                adminNotes: req.body.adminNotes,
                rejectionReason: req.body.rejectionReason,
            };
            const application = await jobApplicationService.updateJobApplication(applicationId, data);
            res.json({
                success: true,
                message: "Application updated successfully",
                data: application,
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
            const filters = {
                jobId: req.query.jobId ? parseInt(req.query.jobId) : undefined,
                status: req.query.status,
                search: req.query.search,
                ratingMin: req.query.ratingMin ? parseInt(req.query.ratingMin) : undefined,
            };
            const result = await jobApplicationService.getJobApplications(filters, page, limit);
            res.json({
                success: true,
                message: "Applications retrieved successfully",
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const applicationId = parseInt(req.params.id);
            const application = await jobApplicationService.getJobApplicationById(applicationId);
            if (!application) {
                res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
                return;
            }
            res.json({
                success: true,
                message: "Application retrieved successfully",
                data: application,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getByJob(req, res, next) {
        try {
            const jobId = parseInt(req.params.jobId);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await jobApplicationService.getApplicationsByJob(jobId, page, limit);
            res.json({
                success: true,
                message: "Job applications retrieved successfully",
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const applicationId = parseInt(req.params.id);
            await jobApplicationService.deleteJobApplication(applicationId);
            res.json({
                success: true,
                message: "Application deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getStats(req, res, next) {
        try {
            const jobId = req.query.jobId ? parseInt(req.query.jobId) : undefined;
            const stats = await jobApplicationService.getApplicationStats(jobId);
            res.json({
                success: true,
                message: "Application statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JobApplicationController = JobApplicationController;
//# sourceMappingURL=job-application.controller.js.map