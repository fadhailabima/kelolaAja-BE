"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kelolaaja_feature_controller_1 = require("../controllers/kelolaaja-feature.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, kelolaaja_feature_controller_1.KelolaAjaFeatureController.listPublicFeatures);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), kelolaaja_feature_controller_1.KelolaAjaFeatureController.listAllFeatures);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), kelolaaja_feature_controller_1.KelolaAjaFeatureController.createFeature);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), kelolaaja_feature_controller_1.KelolaAjaFeatureController.updateFeature);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), kelolaaja_feature_controller_1.KelolaAjaFeatureController.deleteFeature);
exports.default = router;
//# sourceMappingURL=kelolaaja-feature.routes.js.map