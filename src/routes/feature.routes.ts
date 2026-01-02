import { Router } from "express";
import { FeatureController } from "../controllers/feature.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, FeatureController.listPublicFeatures);
router.get("/:id", detectLocale, FeatureController.getPublicFeature);

// Admin routes
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), FeatureController.listAllFeatures);
router.get("/admin/categories", authenticate, authorize("Admin", "Editor"), FeatureController.getCategories);
router.post("/admin", authenticate, authorize("Admin"), FeatureController.createFeature);
router.put("/admin/:id", authenticate, authorize("Admin"), FeatureController.updateFeature);
router.delete("/admin/:id", authenticate, authorize("Admin"), FeatureController.deleteFeature);

export default router;
