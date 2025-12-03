"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_application_controller_1 = require("../controllers/job-application.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const middlewares_1 = require("../middlewares");
const job_posting_validator_1 = require("../validators/job-posting.validator");
const router = (0, express_1.Router)();
const controller = new job_application_controller_1.JobApplicationController();
router.post("/apply", upload_middleware_1.upload.single("cv"), upload_middleware_1.handleMulterError, (0, middlewares_1.validate)(job_posting_validator_1.createJobApplicationSchema), controller.create);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor", "Viewer"), controller.getAll);
router.get("/admin/stats", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor", "Viewer"), controller.getStats);
router.get("/admin/job/:jobId", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor", "Viewer"), controller.getByJob);
router.get("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor", "Viewer"), controller.getById);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), (0, middlewares_1.validate)(job_posting_validator_1.updateJobApplicationSchema), controller.update);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), controller.delete);
exports.default = router;
//# sourceMappingURL=job-application.routes.js.map