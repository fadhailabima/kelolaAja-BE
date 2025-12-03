"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const advanced_feature_controller_1 = require("../controllers/advanced-feature.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, advanced_feature_controller_1.AdvancedFeatureController.listPublicFeatures);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), advanced_feature_controller_1.AdvancedFeatureController.listAllFeatures);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), advanced_feature_controller_1.AdvancedFeatureController.createFeature);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), advanced_feature_controller_1.AdvancedFeatureController.updateFeature);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), advanced_feature_controller_1.AdvancedFeatureController.deleteFeature);
exports.default = router;
//# sourceMappingURL=advanced-feature.routes.js.map