import { Router } from "express";
import { SiteConfigController } from "../controllers/site-config.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", SiteConfigController.listPublic);
router.get("/key/:key", SiteConfigController.getByKey);

// Admin routes (protected)
router.get("/admin", authenticate, SiteConfigController.listAll);
router.post("/admin", authenticate, SiteConfigController.create);
router.put("/admin/:id", authenticate, SiteConfigController.update);
router.put("/admin/key/:key", authenticate, SiteConfigController.updateByKey);
router.delete("/admin/:id", authenticate, SiteConfigController.delete);
router.post("/admin/bulk-update", authenticate, SiteConfigController.bulkUpdate);

export default router;
