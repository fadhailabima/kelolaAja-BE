"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialAdminRoutes = exports.testimonialRoutes = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const locale_middleware_1 = require("../middlewares/locale.middleware");
const router = (0, express_1.Router)();
router.get("/", locale_middleware_1.detectLocale, testimonial_controller_1.TestimonialController.listPublicTestimonials);
router.get("/:id", locale_middleware_1.detectLocale, testimonial_controller_1.TestimonialController.getPublicTestimonial);
exports.testimonialRoutes = router;
const adminRouter = (0, express_1.Router)();
adminRouter.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), testimonial_controller_1.TestimonialController.listAllTestimonials);
adminRouter.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), testimonial_controller_1.TestimonialController.createTestimonial);
adminRouter.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), testimonial_controller_1.TestimonialController.updateTestimonial);
adminRouter.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin"), testimonial_controller_1.TestimonialController.deleteTestimonial);
exports.testimonialAdminRoutes = adminRouter;
//# sourceMappingURL=testimonial.routes.js.map