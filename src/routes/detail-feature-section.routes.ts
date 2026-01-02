import { Router } from "express";
import { DetailFeatureSectionController } from "../controllers/detail-feature-section.controller";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, DetailFeatureSectionController.listPublic);

// Admin routes (protected)
router.get("/admin", authenticate, authorize("Admin", "Editor"), DetailFeatureSectionController.listAll);
router.post("/admin", authenticate, authorize("Admin"), DetailFeatureSectionController.create);
router.put("/admin/:id", authenticate, authorize("Admin"), DetailFeatureSectionController.update);
router.delete("/admin/:id", authenticate, authorize("Admin"), DetailFeatureSectionController.delete);

export default router;
