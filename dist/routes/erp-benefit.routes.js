"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const erp_benefit_controller_1 = require("../controllers/erp-benefit.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, erp_benefit_controller_1.ERPBenefitController.listPublicBenefits);
router.get("/admin", auth_middleware_1.authenticate, erp_benefit_controller_1.ERPBenefitController.listAllBenefits);
router.post("/admin", auth_middleware_1.authenticate, erp_benefit_controller_1.ERPBenefitController.createBenefit);
router.put("/admin/:id", auth_middleware_1.authenticate, erp_benefit_controller_1.ERPBenefitController.updateBenefit);
router.delete("/admin/:id", auth_middleware_1.authenticate, erp_benefit_controller_1.ERPBenefitController.deleteBenefit);
exports.default = router;
//# sourceMappingURL=erp-benefit.routes.js.map