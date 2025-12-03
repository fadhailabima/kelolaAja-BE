"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_section_controller_1 = require("../controllers/content-section.controller");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, content_section_controller_1.ContentSectionController.listPublic);
router.get("/key/:key", locale_middleware_1.detectLocale, content_section_controller_1.ContentSectionController.getByKey);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), content_section_controller_1.ContentSectionController.listAll);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), content_section_controller_1.ContentSectionController.create);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), content_section_controller_1.ContentSectionController.update);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), content_section_controller_1.ContentSectionController.delete);
exports.default = router;
//# sourceMappingURL=content-section.routes.js.map