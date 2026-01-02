import { Router } from "express";
import { ERPBenefitController } from "../controllers/erp-benefit.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, ERPBenefitController.listPublicBenefits);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), ERPBenefitController.listAllBenefits);
router.post("/admin", authenticate, authorize("Admin"), ERPBenefitController.createBenefit);
router.put("/admin/:id", authenticate, authorize("Admin"), ERPBenefitController.updateBenefit);
router.delete("/admin/:id", authenticate, authorize("Admin"), ERPBenefitController.deleteBenefit);

export default router;
