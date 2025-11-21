"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_file_controller_1 = require("../controllers/media-file.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/admin", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.listAll);
router.get("/admin/stats", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.getStats);
router.get("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.getById);
router.post("/admin/upload", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.upload);
router.put("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.update);
router.delete("/admin/:id", auth_middleware_1.authenticate, media_file_controller_1.MediaFileController.delete);
exports.default = router;
//# sourceMappingURL=media-file.routes.js.map