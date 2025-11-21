import { Router } from "express";
import { ContactSubmissionController } from "../controllers/contact-submission.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public route for creating submissions
router.post("/", ContactSubmissionController.create);

// Admin routes (protected)
router.get("/admin", authenticate, ContactSubmissionController.listAll);
router.get("/admin/stats", authenticate, ContactSubmissionController.getStats);
router.get("/admin/:id", authenticate, ContactSubmissionController.getById);
router.put("/admin/:id", authenticate, ContactSubmissionController.update);
router.put("/admin/:id/assign", authenticate, ContactSubmissionController.assign);
router.delete("/admin/:id", authenticate, ContactSubmissionController.delete);

export default router;
