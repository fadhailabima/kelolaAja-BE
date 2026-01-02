import { Router } from "express";
import { BenefitStatController } from "../controllers/benefit-stat.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, BenefitStatController.listPublicStats);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), BenefitStatController.listAllStats);
router.post("/admin", authenticate, authorize("Admin"), BenefitStatController.createStat);
router.put("/admin/:id", authenticate, authorize("Admin"), BenefitStatController.updateStat);
router.delete("/admin/:id", authenticate, authorize("Admin"), BenefitStatController.deleteStat);

export default router;
