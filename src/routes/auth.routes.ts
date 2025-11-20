import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

// Protected routes
router.get("/me", authenticate, AuthController.getProfile);

export default router;
