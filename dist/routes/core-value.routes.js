"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const core_value_controller_1 = require("../controllers/core-value.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, core_value_controller_1.CoreValueController.listPublicValues);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), core_value_controller_1.CoreValueController.listAllValues);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), core_value_controller_1.CoreValueController.createValue);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), core_value_controller_1.CoreValueController.updateValue);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), core_value_controller_1.CoreValueController.deleteValue);
exports.default = router;
//# sourceMappingURL=core-value.routes.js.map