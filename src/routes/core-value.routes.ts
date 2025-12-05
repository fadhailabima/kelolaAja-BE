import { Router } from "express";
import { CoreValueController } from "../controllers/core-value.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { detectLocale } from "../middlewares/locale.middleware";

const router = Router();

// Public routes
router.get("/", detectLocale, CoreValueController.listPublicValues);

// Admin routes
router.get("/admin", authenticate, authorize("Admin", "Editor"), CoreValueController.listAllValues);
router.post("/admin", authenticate, authorize("Admin"), CoreValueController.createValue);
router.put("/admin/:id", authenticate, authorize("Admin"), CoreValueController.updateValue);
router.delete("/admin/:id", authenticate, authorize("Admin"), CoreValueController.deleteValue);

export default router;
