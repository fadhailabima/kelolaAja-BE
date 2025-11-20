import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile routes (accessible by authenticated users)
router.put("/me", UserController.updateProfile);
router.put("/me/password", UserController.changePassword);

// Admin-only routes
router.get("/", authorize("Admin"), UserController.listUsers);
router.post("/", authorize("Admin"), UserController.createUser);
router.get("/:id", authorize("Admin"), UserController.getUserById);
router.put("/:id", authorize("Admin"), UserController.updateUser);
router.delete("/:id", authorize("Admin"), UserController.deleteUser);

export default router;
