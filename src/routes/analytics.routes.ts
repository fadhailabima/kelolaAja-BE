import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public tracking endpoints
router.post("/visitors", AnalyticsController.trackVisitor);
router.post("/page-views", AnalyticsController.trackPageView);

// Admin analytics
router.get("/admin/overview", authenticate, authorize("Admin", "Editor"), AnalyticsController.getOverview);
router.get("/admin/visitors", authenticate, authorize("Admin", "Editor"), AnalyticsController.getVisitors);
router.get("/admin/visitors/:id", authenticate, authorize("Admin", "Editor"), AnalyticsController.getVisitorDetail);
router.get("/admin/page-views", authenticate, authorize("Admin", "Editor"), AnalyticsController.getPageViews);
router.get("/top-pages", authenticate, authorize("Admin", "Editor"), AnalyticsController.getTopPages);

export default router;
