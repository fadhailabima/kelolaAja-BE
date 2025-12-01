// src/routes/job-posting.routes.ts

import { Router } from "express";
import { JobPostingController } from "../controllers/job-posting.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares";
import { createJobPostingSchema, updateJobPostingSchema } from "../validators/job-posting.validator";

const router = Router();
const controller = new JobPostingController();

// Public routes
router.get("/public", controller.getAll);
router.get("/public/slug/:slug", controller.getBySlug);
router.get("/public/:id", controller.getById);

// Admin routes
router.post("/admin", authenticate, authorize("Admin", "Editor"), validate(createJobPostingSchema), controller.create);

router.put("/admin/:id", authenticate, authorize("Admin", "Editor"), validate(updateJobPostingSchema), controller.update);

router.get("/admin", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getAll);

router.get("/admin/stats", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getStats);

router.get("/admin/:id", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getById);

router.delete("/admin/:id", authenticate, authorize("Admin"), controller.delete);

export default router;
