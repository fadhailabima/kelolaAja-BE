import { Router } from "express";
import { MediaFileController } from "../controllers/media-file.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload, handleMulterError } from "../middlewares/upload.middleware";

const router = Router();

// Public routes for serving files
router.get("/serve/:id", MediaFileController.serveFile);
router.get("/download/:id", MediaFileController.downloadFile);

// Admin routes (require authentication)
router.get("/admin", authenticate, MediaFileController.listAll);
router.get("/admin/stats", authenticate, MediaFileController.getStats);
router.get("/admin/:id", authenticate, MediaFileController.getById);
router.post("/admin/upload", authenticate, upload.single('file'), handleMulterError, MediaFileController.upload);
router.put("/admin/:id", authenticate, MediaFileController.update);
router.delete("/admin/:id", authenticate, MediaFileController.delete);

export default router;
