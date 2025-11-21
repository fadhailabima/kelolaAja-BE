import { Request, Response } from "express";
import { ContactSubmissionService } from "../services/contact-submission.service";
import { ResponseUtil } from "../utils/response";

export class ContactSubmissionController {
  /**
   * Get all contact submissions (admin)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters = {
        status: req.query.status as string | undefined,
        assignedTo: req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined,
        source: req.query.source as string | undefined
      };

      const result = await ContactSubmissionService.getAllSubmissions(page, limit, filters);
      const { data, pagination } = result;

      return ResponseUtil.success(res, "Contact submissions retrieved successfully", data, 200, pagination);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Get a single submission by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const submissionId = parseInt(req.params.id);
      const submission = await ContactSubmissionService.getSubmissionById(submissionId);

      return ResponseUtil.success(res, "Contact submission retrieved successfully", submission);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Create a new contact submission (public)
   */
  static async create(req: Request, res: Response) {
    try {
      const submission = await ContactSubmissionService.createSubmission(req.body);

      return ResponseUtil.success(res, "Contact submission created successfully", submission, 201);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Update submission status/notes (admin)
   */
  static async update(req: Request, res: Response) {
    try {
      const submissionId = parseInt(req.params.id);
      const submission = await ContactSubmissionService.updateSubmission(submissionId, req.body);

      return ResponseUtil.success(res, "Contact submission updated successfully", submission);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Assign submission to admin
   */
  static async assign(req: Request, res: Response) {
    try {
      const submissionId = parseInt(req.params.id);
      const { assignedTo } = req.body;

      if (!assignedTo) {
        return ResponseUtil.error(res, "assignedTo is required", null, 400);
      }

      const submission = await ContactSubmissionService.assignSubmission(submissionId, assignedTo);

      return ResponseUtil.success(res, "Contact submission assigned successfully", submission);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Delete a submission
   */
  static async delete(req: Request, res: Response) {
    try {
      const submissionId = parseInt(req.params.id);
      const result = await ContactSubmissionService.deleteSubmission(submissionId);

      return ResponseUtil.success(res, result.message);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Get submission statistics
   */
  static async getStats(_req: Request, res: Response) {
    try {
      const stats = await ContactSubmissionService.getSubmissionStats();

      return ResponseUtil.success(res, "Submission statistics retrieved successfully", stats);
    } catch (error) {
      return ResponseUtil.error(res, error instanceof Error ? error.message : String(error));
    }
  }
}
