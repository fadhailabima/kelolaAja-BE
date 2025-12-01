"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_file_controller_1 = require("../controllers/media-file.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.get("/serve/:id", media_file_controller_1.MediaFileController.serveFile);
router.get("/download/:id", media_file_controller_1.MediaFileController.downloadFile);
router.get("/admin", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.listAll);
router.get("/admin/stats", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.getStats);
router.get("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.getById);
router.post("/admin/upload", auth_middleware_1.authenticate, upload_middleware_1.upload.single("file"), upload_middleware_1.handleMulterError, media_file_controller_1.MediaFileController.upload);
router.put("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.update);
router.delete("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.delete);
exports.default = router;
//# sourceMappingURL=media-file.routes.js.map