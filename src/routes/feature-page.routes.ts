import { Router } from "express";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { FeaturePageController } from "../controllers/feature-page.controller";

const router = Router();

// Public
router.get("/", detectLocale, FeaturePageController.listPublicPages);

// Admin - base page
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), FeaturePageController.listPages);
router.get("/admin/:id", authenticate, authorize("Admin", "Editor"), FeaturePageController.getPageDetail);
router.post("/admin", authenticate, authorize("Admin"), FeaturePageController.createPage);
router.put("/admin/:id", authenticate, authorize("Admin"), FeaturePageController.updatePage);
router.delete("/admin/:id", authenticate, authorize("Admin"), FeaturePageController.deletePage);

// Admin - items
router.get("/admin/:pageId/items", authenticate, authorize("Admin", "Editor"), FeaturePageController.listItems);
router.post("/admin/:pageId/items", authenticate, authorize("Admin"), FeaturePageController.createItem);
router.put("/admin/items/:itemId", authenticate, authorize("Admin"), FeaturePageController.updateItem);
router.delete("/admin/items/:itemId", authenticate, authorize("Admin"), FeaturePageController.deleteItem);

// Public detail
router.get("/:slug", detectLocale, FeaturePageController.getPublicPage);

export default router;
