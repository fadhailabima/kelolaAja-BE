"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_submission_controller_1 = require("../controllers/contact-submission.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", contact_submission_controller_1.ContactSubmissionController.create);
router.get("/admin", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.listAll);
router.get("/admin/stats", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.getStats);
router.get("/admin/:id", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.getById);
router.put("/admin/:id", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.update);
router.put("/admin/:id/assign", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.assign);
router.delete("/admin/:id", auth_middleware_1.authenticate, contact_submission_controller_1.ContactSubmissionController.delete);
exports.default = router;
//# sourceMappingURL=contact-submission.routes.js.map