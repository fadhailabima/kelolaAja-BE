import { Router } from "express";
import { MediaFileController } from "../controllers/media-file.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication (admin only)
router.get("/admin", authenticate, MediaFileController.listAll);
router.get("/admin/stats", authenticate, MediaFileController.getStats);
router.get("/admin/:id", authenticate, MediaFileController.getById);
router.post("/admin/upload", authenticate, MediaFileController.upload);
router.put("/admin/:id", authenticate, MediaFileController.update);
router.delete("/admin/:id", authenticate, MediaFileController.delete);

export default router;
