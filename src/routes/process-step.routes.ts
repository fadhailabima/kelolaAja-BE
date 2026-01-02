import { Router } from "express";
import { ProcessStepController } from "../controllers/process-step.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, ProcessStepController.listPublicSteps);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), ProcessStepController.listAllSteps);
router.post("/admin", authenticate, authorize("Admin"), ProcessStepController.createStep);
router.put("/admin/:id", authenticate, authorize("Admin"), ProcessStepController.updateStep);
router.delete("/admin/:id", authenticate, authorize("Admin"), ProcessStepController.deleteStep);

export default router;
