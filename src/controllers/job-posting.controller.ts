// src/controllers/job-posting.controller.ts

import { Request, Response, NextFunction } from "express";
import { JobPostingService } from "../services/job-posting.service";
import { CreateJobPostingDTO, UpdateJobPostingDTO, JobPostingFilters } from "../types/job-posting.types";
import { Locale } from "@prisma/client";

const jobPostingService = new JobPostingService();

export class JobPostingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateJobPostingDTO = req.body;
      const createdBy = (req as any).user.userId;

      const job = await jobPostingService.createJobPosting(data, createdBy);

      res.status(201).json({
        success: true,
        message: "Job posting created successfully",
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = parseInt(req.params.id);
      const data: UpdateJobPostingDTO = req.body;
      const updatedBy = (req as any).user.userId;

      const job = await jobPostingService.updateJobPosting(jobId, data, updatedBy);

      res.json({
        success: true,
        message: "Job posting updated successfully",
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const locale = req.query.locale as Locale | undefined;

      const filters: JobPostingFilters = {
        jobType: req.query.jobType as any,
        jobLevel: req.query.jobLevel as any,
        workLocation: req.query.workLocation as any,
        city: req.query.city as string,
        department: req.query.department as string,
        isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        isFeatured: req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined,
        search: req.query.search as string
      };

      const result = await jobPostingService.getJobPostings(filters, locale, page, limit);

      res.json({
        success: true,
        message: "Job postings retrieved successfully",
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = parseInt(req.params.id);
      const locale = req.query.locale as Locale | undefined;

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
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug;
      const locale = req.query.locale as Locale | undefined;

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
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = parseInt(req.params.id);

      await jobPostingService.deleteJobPosting(jobId);

      res.json({
        success: true,
        message: "Job posting deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobPostingService.getJobStats();

      res.json({
        success: true,
        message: "Job statistics retrieved successfully",
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}
