import { Router } from "express";
import { ContentSectionController } from "../controllers/content-section.controller";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, ContentSectionController.listPublic);
router.get("/key/:key", detectLocale, ContentSectionController.getByKey);

// Admin routes (protected)
router.get("/admin", authenticate, authorize("Admin", "Editor"), ContentSectionController.listAll);
router.post("/admin", authenticate, authorize("Admin"), ContentSectionController.create);
router.put("/admin/:id", authenticate, authorize("Admin"), ContentSectionController.update);
router.delete("/admin/:id", authenticate, authorize("Admin"), ContentSectionController.delete);

export default router;
