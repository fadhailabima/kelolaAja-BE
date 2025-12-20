import { Router } from "express";
import { MediaFileController } from "../controllers/media-file.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload, handleMulterError } from "../middlewares/upload.middleware";

const router = Router();

// Public routes for serving files
router.get("/serve/:id", MediaFileController.serveFile);
router.get("/download/:id", MediaFileController.downloadFile);

// Admin routes (require authentication)
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), MediaFileController.listAll);
router.get("/admin/stats", authenticate, authorize("Admin", "Editor"), MediaFileController.getStats);
router.get("/admin/:id", authenticate, authorize("Admin", "Editor"), MediaFileController.getById);
router.post(
  "/admin/upload",
  authenticate,
  authorize("Admin", "Editor"),
  upload.single("file"),
  handleMulterError,
  MediaFileController.upload
);
router.put("/admin/:id", authenticate, authorize("Admin"), MediaFileController.update);
router.delete("/admin/:id", authenticate, authorize("Admin"), MediaFileController.delete);

export default router;
