import { Router } from "express";
import { AboutCardController } from "../controllers/about-card.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, AboutCardController.listPublicCards);

// Admin routes
router.get("/admin", authenticate, AboutCardController.listAllCards);
router.post("/admin", authenticate, AboutCardController.createCard);
router.put("/admin/:id", authenticate, AboutCardController.updateCard);
router.delete("/admin/:id", authenticate, AboutCardController.deleteCard);

export default router;
