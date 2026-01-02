// src/routes/job-application.routes.ts

import { Router } from "express";
import { JobApplicationController } from "../controllers/job-application.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload, handleMulterError } from "../middlewares/upload.middleware";
import { validate } from "../middlewares";
import { createJobApplicationSchema, updateJobApplicationSchema } from "../validators/job-posting.validator";

const router = Router();
const controller = new JobApplicationController();

// Public routes - User can apply for jobs
router.post("/apply", upload.single("cv"), handleMulterError, validate(createJobApplicationSchema), controller.create);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getAll);

router.get("/admin/stats", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getStats);

router.get("/admin/job/:jobId", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getByJob);

router.get("/admin/:id", authenticate, authorize("Admin", "Editor", "Viewer"), controller.getById);

router.put("/admin/:id", authenticate, authorize("Admin", "Editor"), validate(updateJobApplicationSchema), controller.update);

router.delete("/admin/:id", authenticate, authorize("Admin"), controller.delete);

export default router;
