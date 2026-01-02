import { Router } from "express";
import { AdvancedFeatureController } from "../controllers/advanced-feature.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, AdvancedFeatureController.listPublicFeatures);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), AdvancedFeatureController.listAllFeatures);
router.post("/admin", authenticate, authorize("Admin"), AdvancedFeatureController.createFeature);
router.put("/admin/:id", authenticate, authorize("Admin"), AdvancedFeatureController.updateFeature);
router.delete("/admin/:id", authenticate, authorize("Admin"), AdvancedFeatureController.deleteFeature);

export default router;
