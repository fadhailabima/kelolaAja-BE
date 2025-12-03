"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detail_feature_section_controller_1 = require("../controllers/detail-feature-section.controller");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, detail_feature_section_controller_1.DetailFeatureSectionController.listPublic);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), detail_feature_section_controller_1.DetailFeatureSectionController.listAll);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), detail_feature_section_controller_1.DetailFeatureSectionController.create);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), detail_feature_section_controller_1.DetailFeatureSectionController.update);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), detail_feature_section_controller_1.DetailFeatureSectionController.delete);
exports.default = router;
//# sourceMappingURL=detail-feature-section.routes.js.map