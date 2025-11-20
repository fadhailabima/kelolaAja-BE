"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.put("/me", user_controller_1.UserController.updateProfile);
router.put("/me/password", user_controller_1.UserController.changePassword);
router.get("/", (0, auth_middleware_1.authorize)("Admin"), user_controller_1.UserController.listUsers);
router.post("/", (0, auth_middleware_1.authorize)("Admin"), user_controller_1.UserController.createUser);
router.get("/:id", (0, auth_middleware_1.authorize)("Admin"), user_controller_1.UserController.getUserById);
router.put("/:id", (0, auth_middleware_1.authorize)("Admin"), user_controller_1.UserController.updateUser);
router.delete("/:id", (0, auth_middleware_1.authorize)("Admin"), user_controller_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map