"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feature_controller_1 = require("../controllers/feature.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, feature_controller_1.FeatureController.listPublicFeatures);
router.get("/:id", locale_middleware_1.detectLocale, feature_controller_1.FeatureController.getPublicFeature);
router.get("/admin/all", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), feature_controller_1.FeatureController.listAllFeatures);
router.get("/admin/categories", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), feature_controller_1.FeatureController.getCategories);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), feature_controller_1.FeatureController.createFeature);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), feature_controller_1.FeatureController.updateFeature);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), feature_controller_1.FeatureController.deleteFeature);
exports.default = router;
//# sourceMappingURL=feature.routes.js.map