import { Router } from "express";
import { ContentSectionController } from "../controllers/content-section.controller";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (with locale detection)
router.get("/", detectLocale, ContentSectionController.listPublic);
router.get("/key/:key", detectLocale, ContentSectionController.getByKey);

// Admin routes (protected)
router.get("/admin", authenticate, ContentSectionController.listAll);
router.post("/admin", authenticate, ContentSectionController.create);
router.put("/admin/:id", authenticate, ContentSectionController.update);
router.delete("/admin/:id", authenticate, ContentSectionController.delete);

export default router;
