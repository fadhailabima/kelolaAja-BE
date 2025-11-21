import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication (admin only)
router.get("/admin", authenticate, AuditLogController.listAll);
router.get("/admin/stats", authenticate, AuditLogController.getStats);
router.get("/admin/entity/:entityType/:entityId", authenticate, AuditLogController.getEntityLogs);
router.get("/admin/user/:userId", authenticate, AuditLogController.getUserLogs);
router.post("/admin", authenticate, AuditLogController.create);

export default router;
