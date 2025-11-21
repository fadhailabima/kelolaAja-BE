import { Router } from "express";
import { DetailFeatureSectionController } from "../controllers/detail-feature-section.controller";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, DetailFeatureSectionController.listPublic);

// Admin routes (protected)
router.get("/admin", authenticate, DetailFeatureSectionController.listAll);
router.post("/admin", authenticate, DetailFeatureSectionController.create);
router.put("/admin/:id", authenticate, DetailFeatureSectionController.update);
router.delete("/admin/:id", authenticate, DetailFeatureSectionController.delete);

export default router;
