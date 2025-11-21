import { Router } from "express";
import { ERPBenefitController } from "../controllers/erp-benefit.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, ERPBenefitController.listPublicBenefits);

// Admin routes
router.get("/admin", authenticate, ERPBenefitController.listAllBenefits);
router.post("/admin", authenticate, ERPBenefitController.createBenefit);
router.put("/admin/:id", authenticate, ERPBenefitController.updateBenefit);
router.delete("/admin/:id", authenticate, ERPBenefitController.deleteBenefit);

export default router;
