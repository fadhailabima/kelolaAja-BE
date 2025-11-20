import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import pricingRoutes from "./pricing.routes";
import featureRoutes from "./feature.routes";
import partnerRoutes from "./partner.routes";
import { testimonialRoutes, testimonialAdminRoutes } from "./testimonial.routes";
import { faqRoutes, faqCategoryAdminRoutes, faqAdminRoutes } from "./faq.routes";
import benefitStatRoutes from "./benefit-stat.routes";
import processStepRoutes from "./process-step.routes";
import erpBenefitRoutes from "./erp-benefit.routes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/pricing-plans", pricingRoutes);
router.use("/features", featureRoutes);
router.use("/partners", partnerRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/faqs", faqRoutes);
router.use("/benefit-stats", benefitStatRoutes);
router.use("/process-steps", processStepRoutes);
router.use("/erp-benefits", erpBenefitRoutes);

// Admin routes
router.use("/admin/testimonials", testimonialAdminRoutes);
router.use("/admin/faq-categories", faqCategoryAdminRoutes);
router.use("/admin/faqs", faqAdminRoutes);

export default router;
