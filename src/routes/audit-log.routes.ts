import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication (admin only) - keep for backward compatibility
router.get("/admin", authenticate, AuditLogController.listAll);
router.get("/admin/stats", authenticate, AuditLogController.getStats);
router.get("/admin/entity/:entityType/:entityId", authenticate, AuditLogController.getEntityLogs);
router.get("/admin/user/:userId", authenticate, AuditLogController.getUserLogs);
router.post("/admin", authenticate, AuditLogController.create);

export default router;

// Admin routes for /admin/audit-logs pattern
const adminRouter = Router();

adminRouter.get("/", authenticate, AuditLogController.listAll);
adminRouter.get("/stats", authenticate, AuditLogController.getStats);
adminRouter.get("/entity/:entityType/:entityId", authenticate, AuditLogController.getEntityLogs);
adminRouter.get("/user/:userId", authenticate, AuditLogController.getUserLogs);
adminRouter.post("/", authenticate, AuditLogController.create);

export const auditLogAdminRoutes = adminRouter;
