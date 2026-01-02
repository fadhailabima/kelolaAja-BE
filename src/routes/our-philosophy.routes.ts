import { Router } from "express";
import { OurPhilosophyController } from "../controllers/our-philosophy.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, OurPhilosophyController.listPublicPhilosophies);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), OurPhilosophyController.listAllPhilosophies);
router.post("/admin", authenticate, authorize("Admin"), OurPhilosophyController.createPhilosophy);
router.put("/admin/:id", authenticate, authorize("Admin"), OurPhilosophyController.updatePhilosophy);
router.delete("/admin/:id", authenticate, authorize("Admin"), OurPhilosophyController.deletePhilosophy);

export default router;
