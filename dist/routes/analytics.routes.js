"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/visitors", analytics_controller_1.AnalyticsController.trackVisitor);
router.post("/page-views", analytics_controller_1.AnalyticsController.trackPageView);
router.get("/admin/overview", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), analytics_controller_1.AnalyticsController.getOverview);
router.get("/admin/visitors", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), analytics_controller_1.AnalyticsController.getVisitors);
router.get("/admin/visitors/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), analytics_controller_1.AnalyticsController.getVisitorDetail);
router.get("/admin/page-views", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("Admin", "Editor"), analytics_controller_1.AnalyticsController.getPageViews);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map