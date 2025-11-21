import { Router } from "express";
import { FAQCategoryController } from "../controllers/faq-category.controller";
import { FAQController } from "../controllers/faq.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes - FAQ Categories
router.get("/categories", detectLocale, FAQCategoryController.listPublicCategories);

// Public routes - FAQs
router.get("/", detectLocale, FAQController.listPublicFAQs);
router.get("/by-category", detectLocale, FAQController.listPublicFAQsByCategory);
router.get("/:id", detectLocale, FAQController.getPublicFAQ);

export const faqRoutes = router;

// Admin routes - FAQ Categories
const categoryAdminRouter = Router();

categoryAdminRouter.get("/", authenticate, authorize("Admin", "Editor"), FAQCategoryController.listAllCategories);
categoryAdminRouter.post("/", authenticate, authorize("Admin"), FAQCategoryController.createCategory);
categoryAdminRouter.put("/:id", authenticate, authorize("Admin"), FAQCategoryController.updateCategory);
categoryAdminRouter.delete("/:id", authenticate, authorize("Admin"), FAQCategoryController.deleteCategory);

export const faqCategoryAdminRoutes = categoryAdminRouter;

// Admin routes - FAQs
const faqAdminRouter = Router();

faqAdminRouter.get("/", authenticate, authorize("Admin", "Editor"), FAQController.listAllFAQs);
faqAdminRouter.post("/", authenticate, authorize("Admin"), FAQController.createFAQ);
faqAdminRouter.put("/:id", authenticate, authorize("Admin"), FAQController.updateFAQ);
faqAdminRouter.delete("/:id", authenticate, authorize("Admin"), FAQController.deleteFAQ);

export const faqAdminRoutes = faqAdminRouter;
