import { Router } from 'express';
import { TestimonialController } from '../controllers/testimonial.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { detectLocale } from '../middlewares/locale.middleware';

const router = Router();

// Public routes (with locale detection)
router.get('/', detectLocale, TestimonialController.listPublicTestimonials);
router.get('/:id', detectLocale, TestimonialController.getPublicTestimonial);

export const testimonialRoutes = router;

// Admin routes
const adminRouter = Router();

adminRouter.get('/', authenticate, authorize('Admin', 'Editor'), TestimonialController.listAllTestimonials);
adminRouter.post('/', authenticate, authorize('Admin'), TestimonialController.createTestimonial);
adminRouter.put('/:id', authenticate, authorize('Admin'), TestimonialController.updateTestimonial);
adminRouter.delete('/:id', authenticate, authorize('Admin'), TestimonialController.deleteTestimonial);

export const testimonialAdminRoutes = adminRouter;
