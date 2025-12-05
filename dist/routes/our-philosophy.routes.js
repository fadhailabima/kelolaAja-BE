"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const our_philosophy_controller_1 = require("../controllers/our-philosophy.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, our_philosophy_controller_1.OurPhilosophyController.listPublicPhilosophies);
router.get("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), our_philosophy_controller_1.OurPhilosophyController.listAllPhilosophies);
router.post("/admin", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), our_philosophy_controller_1.OurPhilosophyController.createPhilosophy);
router.put("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), our_philosophy_controller_1.OurPhilosophyController.updatePhilosophy);
router.delete("/admin/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), our_philosophy_controller_1.OurPhilosophyController.deletePhilosophy);
exports.default = router;
//# sourceMappingURL=our-philosophy.routes.js.map