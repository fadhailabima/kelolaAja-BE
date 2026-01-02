import { Request, Response, NextFunction } from "express";
import { IndustryService } from "../services/industry.service";
import { ResponseUtil } from "../utils/response";
import { Locale } from "@prisma/client";

export class IndustryController {
  /**
   * GET /api/industries
   */
  static async listPublicIndustries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const industries = await IndustryService.getPublicIndustries(locale);
      ResponseUtil.success(res, "Industries retrieved successfully", industries);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/:slug
   */
  static async getPublicIndustry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug;
      const locale = req.locale || Locale.id;
      const industry = await IndustryService.getPublicIndustryBySlug(slug, locale);
      ResponseUtil.success(res, "Industry retrieved successfully", industry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/admin/all
   */
  static async listIndustries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isActive = req.query.isActive as string;

      const result = await IndustryService.getIndustries(page, limit, search, isActive);
      ResponseUtil.success(res, "Industries retrieved successfully", result.data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/admin/:id
   */
  static async getIndustryDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.id);
      const industry = await IndustryService.getIndustryDetail(industryId);
      ResponseUtil.success(res, "Industry detail retrieved successfully", industry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/industries/admin
   */
  static async createIndustry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const industry = await IndustryService.createIndustry(req.body, userId);
      ResponseUtil.created(res, "Industry created successfully", industry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/industries/admin/:id
   */
  static async updateIndustry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const industry = await IndustryService.updateIndustry(industryId, req.body, userId);
      ResponseUtil.success(res, "Industry updated successfully", industry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/industries/admin/:id
   */
  static async deleteIndustry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.id);
      const userId = req.user!.userId;
      await IndustryService.deleteIndustry(industryId, userId);
      ResponseUtil.success(res, "Industry deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/admin/:industryId/problems
   */
  static async listProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const problems = await IndustryService.listProblems(industryId);
      ResponseUtil.success(res, "Industry problems retrieved successfully", problems);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/industries/admin/:industryId/problems
   */
  static async createProblem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const problem = await IndustryService.createProblem(industryId, req.body);
      ResponseUtil.created(res, "Industry problem created successfully", problem);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/industries/admin/problems/:problemId
   */
  static async updateProblem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problemId = parseInt(req.params.problemId);
      const problem = await IndustryService.updateProblem(problemId, req.body);
      ResponseUtil.success(res, "Industry problem updated successfully", problem);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/industries/admin/problems/:problemId
   */
  static async deleteProblem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problemId = parseInt(req.params.problemId);
      await IndustryService.deleteProblem(problemId);
      ResponseUtil.success(res, "Industry problem deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/admin/:industryId/solutions
   */
  static async listSolutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const solutions = await IndustryService.listSolutions(industryId);
      ResponseUtil.success(res, "Industry solutions retrieved successfully", solutions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/industries/admin/:industryId/solutions
   */
  static async createSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const solution = await IndustryService.createSolution(industryId, req.body);
      ResponseUtil.created(res, "Industry solution created successfully", solution);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/industries/admin/solutions/:solutionId
   */
  static async updateSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const solutionId = parseInt(req.params.solutionId);
      const solution = await IndustryService.updateSolution(solutionId, req.body);
      ResponseUtil.success(res, "Industry solution updated successfully", solution);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/industries/admin/solutions/:solutionId
   */
  static async deleteSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const solutionId = parseInt(req.params.solutionId);
      await IndustryService.deleteSolution(solutionId);
      ResponseUtil.success(res, "Industry solution deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/industries/admin/:industryId/media
   */
  static async listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const media = await IndustryService.listMedia(industryId);
      ResponseUtil.success(res, "Industry media retrieved successfully", media);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/industries/admin/:industryId/media
   */
  static async addMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industryId = parseInt(req.params.industryId);
      const media = await IndustryService.addMedia(industryId, req.body);
      ResponseUtil.created(res, "Industry media added successfully", media);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/industries/admin/media/:mediaId
   */
  static async updateMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaId = parseInt(req.params.mediaId);
      const media = await IndustryService.updateMedia(mediaId, req.body);
      ResponseUtil.success(res, "Industry media updated successfully", media);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/industries/admin/media/:mediaId
   */
  static async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaId = parseInt(req.params.mediaId);
      await IndustryService.deleteMedia(mediaId);
      ResponseUtil.success(res, "Industry media deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
