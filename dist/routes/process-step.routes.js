"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const process_step_controller_1 = require("../controllers/process-step.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get('/', locale_middleware_1.detectLocale, process_step_controller_1.ProcessStepController.listPublicSteps);
router.get('/admin', auth_middleware_1.authenticate, process_step_controller_1.ProcessStepController.listAllSteps);
router.post('/admin', auth_middleware_1.authenticate, process_step_controller_1.ProcessStepController.createStep);
router.put('/admin/:id', auth_middleware_1.authenticate, process_step_controller_1.ProcessStepController.updateStep);
router.delete('/admin/:id', auth_middleware_1.authenticate, process_step_controller_1.ProcessStepController.deleteStep);
exports.default = router;
//# sourceMappingURL=process-step.routes.js.map