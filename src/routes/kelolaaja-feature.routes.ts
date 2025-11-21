import { Router } from "express";
import { KelolaAjaFeatureController } from "../controllers/kelolaaja-feature.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, KelolaAjaFeatureController.listPublicFeatures);

// Admin routes
router.get("/admin", authenticate, KelolaAjaFeatureController.listAllFeatures);
router.post("/admin", authenticate, KelolaAjaFeatureController.createFeature);
router.put("/admin/:id", authenticate, KelolaAjaFeatureController.updateFeature);
router.delete("/admin/:id", authenticate, KelolaAjaFeatureController.deleteFeature);

export default router;
