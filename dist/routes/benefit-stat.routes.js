"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const benefit_stat_controller_1 = require("../controllers/benefit-stat.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get('/', locale_middleware_1.detectLocale, benefit_stat_controller_1.BenefitStatController.listPublicStats);
router.get('/admin', auth_middleware_1.authenticate, benefit_stat_controller_1.BenefitStatController.listAllStats);
router.post('/admin', auth_middleware_1.authenticate, benefit_stat_controller_1.BenefitStatController.createStat);
router.put('/admin/:id', auth_middleware_1.authenticate, benefit_stat_controller_1.BenefitStatController.updateStat);
router.delete('/admin/:id', auth_middleware_1.authenticate, benefit_stat_controller_1.BenefitStatController.deleteStat);
exports.default = router;
//# sourceMappingURL=benefit-stat.routes.js.map