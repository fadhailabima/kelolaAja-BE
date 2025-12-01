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
import aboutCardRoutes from "./about-card.routes";
import advancedFeatureRoutes from "./advanced-feature.routes";
import kelolaAjaFeatureRoutes from "./kelolaaja-feature.routes";
import detailFeatureSectionRoutes from "./detail-feature-section.routes";
import contentSectionRoutes from "./content-section.routes";
import siteConfigRoutes from "./site-config.routes";
import mediaFileRoutes from "./media-file.routes";
import contactSubmissionRoutes from "./contact-submission.routes";
import auditLogRoutes from "./audit-log.routes";
import industryRoutes from "./industry.routes";
import featurePageRoutes from "./feature-page.routes";
import analyticsRoutes from "./analytics.routes";
import jobPostingRoutes from "./job-posting.routes";
import jobApplicationRoutes from "./job-application.routes";

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
router.use("/about-cards", aboutCardRoutes);
router.use("/advanced-features", advancedFeatureRoutes);
router.use("/kelolaaja-features", kelolaAjaFeatureRoutes);
router.use("/detail-feature-sections", detailFeatureSectionRoutes);
router.use("/content-sections", contentSectionRoutes);
router.use("/site-config", siteConfigRoutes);
router.use("/media-files", mediaFileRoutes);
router.use("/contact-submissions", contactSubmissionRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/industries", industryRoutes);
router.use("/feature-pages", featurePageRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/jobs", jobPostingRoutes);
router.use("/job-applications", jobApplicationRoutes);

// Admin routes
router.use("/admin/testimonials", testimonialAdminRoutes);
router.use("/admin/faq-categories", faqCategoryAdminRoutes);
router.use("/admin/faqs", faqAdminRoutes);

export default router;
