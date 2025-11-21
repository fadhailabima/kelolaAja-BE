import { Router } from "express";
import { PartnerController } from "../controllers/partner.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public Routes
router.get("/", detectLocale, PartnerController.listPublicPartners);

// Admin routes
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), PartnerController.listAllPartners);
router.post("/admin", authenticate, authorize("Admin"), PartnerController.createPartner);
router.put("/admin/:id", authenticate, authorize("Admin"), PartnerController.updatePartner);
router.delete("/admin/:id", authenticate, authorize("Admin"), PartnerController.deletePartner);

export default router;
