import { Router } from "express";
import { AboutCardController } from "../controllers/about-card.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, AboutCardController.listPublicCards);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), AboutCardController.listAllCards);
router.post("/admin", authenticate, authorize("Admin"), AboutCardController.createCard);
router.put("/admin/:id", authenticate, authorize("Admin"), AboutCardController.updateCard);
router.delete("/admin/:id", authenticate, authorize("Admin"), AboutCardController.deleteCard);

export default router;
