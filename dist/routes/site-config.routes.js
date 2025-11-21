"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const site_config_controller_1 = require("../controllers/site-config.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", site_config_controller_1.SiteConfigController.listPublic);
router.get("/key/:key", site_config_controller_1.SiteConfigController.getByKey);
router.get("/admin", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.listAll);
router.post("/admin", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.create);
router.put("/admin/:id", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.update);
router.put("/admin/key/:key", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.updateByKey);
router.delete("/admin/:id", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.delete);
router.post("/admin/bulk-update", auth_middleware_1.authenticate, site_config_controller_1.SiteConfigController.bulkUpdate);
exports.default = router;
//# sourceMappingURL=site-config.routes.js.map