import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';
import { Locale } from '@prisma/client';
import { TestimonialService } from '../services/testimonial.service';

export class TestimonialController {
  /**
   * GET /api/testimonials
   * Get all active testimonials (Public endpoint)
   */
  static async listPublicTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locale = req.locale || Locale.id;
      const isFeatured = req.query.featured === 'true' ? true : undefined;

      const testimonials = await TestimonialService.getPublicTestimonials(locale, isFeatured);
      ResponseUtil.success(res, 'Testimonials retrieved successfully', testimonials);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/testimonials/:id
   * Get single testimonial by ID (Public endpoint)
   */
  static async getPublicTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonialId = parseInt(req.params.id);
      const locale = req.locale || Locale.id;

      const testimonial = await TestimonialService.getPublicTestimonialById(testimonialId, locale);
      ResponseUtil.success(res, 'Testimonial retrieved successfully', testimonial);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/testimonials
   * Get all testimonials with all translations (Admin only)
   */
  static async listAllTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isFeatured = req.query.featured as string;
      const isActive = req.query.isActive as string;

      const result = await TestimonialService.getAllTestimonials(
        page,
        limit,
        search,
        isFeatured,
        isActive
      );

      ResponseUtil.success(
        res,
        'Testimonials retrieved successfully',
        result.data,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/testimonials
   * Create new testimonial (Admin only)
   */
  static async createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await TestimonialService.createTestimonial(req.body, req.user!.userId);
      ResponseUtil.created(res, 'Testimonial created successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/testimonials/:id
   * Update testimonial (Admin only)
   */
  static async updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonialId = parseInt(req.params.id);
      const result = await TestimonialService.updateTestimonial(
        testimonialId,
        req.body,
        req.user!.userId
      );
      ResponseUtil.success(res, 'Testimonial updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/testimonials/:id
   * Soft delete testimonial (Admin only)
   */
  static async deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonialId = parseInt(req.params.id);
      await TestimonialService.deleteTestimonial(testimonialId, req.user!.userId);
      ResponseUtil.success(res, 'Testimonial deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
