"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_log_controller_1 = require("../controllers/audit-log.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/admin", auth_middleware_1.authenticate, audit_log_controller_1.AuditLogController.listAll);
router.get("/admin/stats", auth_middleware_1.authenticate, audit_log_controller_1.AuditLogController.getStats);
router.get("/admin/entity/:entityType/:entityId", auth_middleware_1.authenticate, audit_log_controller_1.AuditLogController.getEntityLogs);
router.get("/admin/user/:userId", auth_middleware_1.authenticate, audit_log_controller_1.AuditLogController.getUserLogs);
router.post("/admin", auth_middleware_1.authenticate, audit_log_controller_1.AuditLogController.create);
exports.default = router;
//# sourceMappingURL=audit-log.routes.js.map