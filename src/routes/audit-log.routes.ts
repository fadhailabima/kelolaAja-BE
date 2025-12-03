import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication (admin only) - keep for backward compatibility
router.get("/admin", authenticate, authorize("Admin", "Editor"), AuditLogController.listAll);
router.get("/admin/stats", authenticate, authorize("Admin", "Editor"), AuditLogController.getStats);
router.get("/admin/entity/:entityType/:entityId", authenticate, authorize("Admin", "Editor"), AuditLogController.getEntityLogs);
router.get("/admin/user/:userId", authenticate, authorize("Admin", "Editor"), AuditLogController.getUserLogs);
router.post("/admin", authenticate, authorize("Admin"), AuditLogController.create);

export default router;

// Admin routes for /admin/audit-logs pattern
const adminRouter = Router();

adminRouter.get("/", authenticate, authorize("Admin", "Editor"), AuditLogController.listAll);
adminRouter.get("/stats", authenticate, authorize("Admin", "Editor"), AuditLogController.getStats);
adminRouter.get("/entity/:entityType/:entityId", authenticate, authorize("Admin", "Editor"), AuditLogController.getEntityLogs);
adminRouter.get("/user/:userId", authenticate, authorize("Admin", "Editor"), AuditLogController.getUserLogs);
adminRouter.post("/", authenticate, authorize("Admin"), AuditLogController.create);

export const auditLogAdminRoutes = adminRouter;
