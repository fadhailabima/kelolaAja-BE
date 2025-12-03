import { Router } from "express";
import { SiteConfigController } from "../controllers/site-config.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", SiteConfigController.listPublic);
router.get("/key/:key", SiteConfigController.getByKey);

// Admin routes (protected)
router.get("/admin", authenticate, authorize("Admin", "Editor"), SiteConfigController.listAll);
router.post("/admin", authenticate, authorize("Admin"), SiteConfigController.create);
router.put("/admin/:id", authenticate, authorize("Admin"), SiteConfigController.update);
router.put("/admin/key/:key", authenticate, authorize("Admin"), SiteConfigController.updateByKey);
router.delete("/admin/:id", authenticate, authorize("Admin"), SiteConfigController.delete);
router.post("/admin/bulk-update", authenticate, authorize("Admin"), SiteConfigController.bulkUpdate);

export default router;
