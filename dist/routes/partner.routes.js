"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partner_controller_1 = require("../controllers/partner.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, partner_controller_1.PartnerController.listPublicPartners);
router.get("/admin/all", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), partner_controller_1.PartnerController.listAllPartners);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), partner_controller_1.PartnerController.createPartner);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), partner_controller_1.PartnerController.updatePartner);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), partner_controller_1.PartnerController.deletePartner);
exports.default = router;
//# sourceMappingURL=partner.routes.js.map