import { Router } from "express";
import { PricingController } from "../controllers/pricing.controller";
import { PlanFeatureController } from "../controllers/plan-feature.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, PricingController.listPublicPlans);
router.get("/:id", detectLocale, PricingController.getPublicPlan);

// Plan features - Public
router.get("/:planId/features", detectLocale, PlanFeatureController.getPlanFeatures);

// Admin routes
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), PricingController.listAllPlans);
router.post("/admin", authenticate, authorize("Admin"), PricingController.createPlan);
router.put("/admin/:id", authenticate, authorize("Admin"), PricingController.updatePlan);
router.delete("/admin/:id", authenticate, authorize("Admin"), PricingController.deletePlan);

// Plan features - Admin
router.post("/admin/:planId/features", authenticate, authorize("Admin"), PlanFeatureController.addFeatureToPlan);
router.post("/admin/:planId/features/bulk", authenticate, authorize("Admin"), PlanFeatureController.bulkAddFeatures);
router.put("/admin/:planId/features/:featureId", authenticate, authorize("Admin"), PlanFeatureController.updatePlanFeature);
router.delete(
  "/admin/:planId/features/:featureId",
  authenticate,
  authorize("Admin"),
  PlanFeatureController.removeFeatureFromPlan
);

export default router;
