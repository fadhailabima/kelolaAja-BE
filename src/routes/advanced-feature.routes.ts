import { Router } from "express";
import { AdvancedFeatureController } from "../controllers/advanced-feature.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, AdvancedFeatureController.listPublicFeatures);

// Admin routes
router.get("/admin", authenticate, AdvancedFeatureController.listAllFeatures);
router.post("/admin", authenticate, AdvancedFeatureController.createFeature);
router.put("/admin/:id", authenticate, AdvancedFeatureController.updateFeature);
router.delete("/admin/:id", authenticate, AdvancedFeatureController.deleteFeature);

export default router;
