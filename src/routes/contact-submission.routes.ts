import { Router } from "express";
import { ContactSubmissionController } from "../controllers/contact-submission.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public route for creating submissions
router.post("/", ContactSubmissionController.create);

// Admin routes (protected) - keep for backward compatibility
router.get("/admin", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.listAll);
router.get("/admin/stats", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.getStats);
router.get("/admin/:id", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.getById);
router.put("/admin/:id", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.update);
router.put("/admin/:id/assign", authenticate, authorize("Admin"), ContactSubmissionController.assign);
router.delete("/admin/:id", authenticate, authorize("Admin"), ContactSubmissionController.delete);

export default router;

// Admin routes for /admin/contact-submissions pattern
const adminRouter = Router();

adminRouter.get("/", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.listAll);
adminRouter.get("/stats", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.getStats);
adminRouter.get("/:id", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.getById);
adminRouter.put("/:id", authenticate, authorize("Admin", "Editor"), ContactSubmissionController.update);
adminRouter.put("/:id/assign", authenticate, authorize("Admin"), ContactSubmissionController.assign);
adminRouter.delete("/:id", authenticate, authorize("Admin"), ContactSubmissionController.delete);

export const contactSubmissionAdminRoutes = adminRouter;
