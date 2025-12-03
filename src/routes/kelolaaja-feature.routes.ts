import { Router } from "express";
import { KelolaAjaFeatureController } from "../controllers/kelolaaja-feature.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, KelolaAjaFeatureController.listPublicFeatures);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), KelolaAjaFeatureController.listAllFeatures);
router.post("/admin", authenticate, authorize("Admin"), KelolaAjaFeatureController.createFeature);
router.put("/admin/:id", authenticate, authorize("Admin"), KelolaAjaFeatureController.updateFeature);
router.delete("/admin/:id", authenticate, authorize("Admin"), KelolaAjaFeatureController.deleteFeature);

export default router;
