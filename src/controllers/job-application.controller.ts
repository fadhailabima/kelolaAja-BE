// src/controllers/job-application.controller.ts

import { Request, Response, NextFunction } from "express";
import { JobApplicationService } from "../services/job-application.service";
import { CreateJobApplicationDTO, UpdateJobApplicationDTO, JobApplicationFilters } from "../types/job-posting.types";
import { FileUtil } from "../utils/file.util";

const jobApplicationService = new JobApplicationService();

export class JobApplicationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Handle CV file upload if present
      let cvFileId: number | undefined;

      if (req.file) {
        const { FileUtil } = await import("../utils/file.util");
        const { MediaFileService } = await import("../services/media-file.service");

        // Get file type
        const fileType = FileUtil.getFileType(req.file.mimetype);

        // Create media file record for CV
        const mediaFile = await MediaFileService.createFile({
          fileName: req.file.originalname,
          filePath: req.file.path.replace(/\\/g, "/"),
          fileType,
          mimeType: req.file.mimetype,
          fileSize: BigInt(req.file.size),
          altText: `CV - ${req.body.applicantName}`,
          storageType: "local",
          isPublic: false,
          uploadedBy: (req as any).user?.userId,
        });

        cvFileId = mediaFile.fileId;
      }

      const data: CreateJobApplicationDTO = {
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

      // Serialize BigInt fields before sending response
      const serializedApplication = {
        ...application,
        cvFile: application.cvFile ? {
          ...application.cvFile,
          fileSize: Number(application.cvFile.fileSize)
        } : null
      };

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: serializedApplication,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationId = parseInt(req.params.id);
      const data: UpdateJobApplicationDTO = {
        status: req.body.status,
        rating: req.body.rating ? parseInt(req.body.rating) : undefined,
        adminNotes: req.body.adminNotes,
        rejectionReason: req.body.rejectionReason,
      };

      const application = await jobApplicationService.updateJobApplication(applicationId, data);

      // Serialize BigInt
      const serializedApplication = {
        ...application,
        cvFile: application.cvFile ? {
          ...application.cvFile,
          fileSize: Number(application.cvFile.fileSize)
        } : null
      };

      res.json({
        success: true,
        message: "Application updated successfully",
        data: serializedApplication,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: JobApplicationFilters = {
        jobId: req.query.jobId ? parseInt(req.query.jobId as string) : undefined,
        status: req.query.status as any,
        search: req.query.search as string,
        ratingMin: req.query.ratingMin ? parseInt(req.query.ratingMin as string) : undefined,
      };

      const result = await jobApplicationService.getJobApplications(filters, page, limit);

      // Serialize BigInt fields in the list
      const serializedData = result.data.map(app => ({
        ...app,
        cvFile: app.cvFile ? {
          ...app.cvFile,
          fileSize: Number(app.cvFile.fileSize)
        } : null
      }));

      res.json({
        success: true,
        message: "Applications retrieved successfully",
        ...result,
        data: serializedData
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Serialize BigInt
      const serializedApplication = {
        ...application,
        cvFile: application.cvFile ? {
          ...application.cvFile,
          fileSize: Number(application.cvFile.fileSize),
          fileUrl: FileUtil.getFileUrl(application.cvFile.filePath)
        } : null
      };

      res.json({
        success: true,
        message: "Application retrieved successfully",
        data: serializedApplication,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = parseInt(req.params.jobId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await jobApplicationService.getApplicationsByJob(jobId, page, limit);

      // Serialize BigInt fields
      const serializedData = result.data.map(app => ({
        ...app,
        cvFile: app.cvFile ? {
          ...app.cvFile,
          fileSize: Number(app.cvFile.fileSize),
          fileUrl: FileUtil.getFileUrl(app.cvFile.filePath)
        } : null
      }));

      res.json({
        success: true,
        message: "Job applications retrieved successfully",
        ...result,
        data: serializedData
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationId = parseInt(req.params.id);

      await jobApplicationService.deleteJobApplication(applicationId);

      res.json({
        success: true,
        message: "Application deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.query.jobId ? parseInt(req.query.jobId as string) : undefined;

      const stats = await jobApplicationService.getApplicationStats(jobId);

      res.json({
        success: true,
        message: "Application statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
