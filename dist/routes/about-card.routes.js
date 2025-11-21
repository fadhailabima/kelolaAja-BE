"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const about_card_controller_1 = require("../controllers/about-card.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, about_card_controller_1.AboutCardController.listPublicCards);
router.get("/admin", auth_middleware_1.authenticate, about_card_controller_1.AboutCardController.listAllCards);
router.post("/admin", auth_middleware_1.authenticate, about_card_controller_1.AboutCardController.createCard);
router.put("/admin/:id", auth_middleware_1.authenticate, about_card_controller_1.AboutCardController.updateCard);
router.delete("/admin/:id", auth_middleware_1.authenticate, about_card_controller_1.AboutCardController.deleteCard);
exports.default = router;
//# sourceMappingURL=about-card.routes.js.map