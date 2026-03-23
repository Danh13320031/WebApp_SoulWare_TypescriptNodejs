"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/admin/auth.controller"));
const auth_validate_1 = __importDefault(require("../../validators/admin/auth.validate"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const authRoute = (0, express_1.Router)();
authRoute.get("/login", auth_controller_1.default.loginGet);
authRoute.post("/login", auth_validate_1.default.loginValidate, auth_controller_1.default.loginPost);
authRoute.get("/logout", auth_controller_1.default.logoutGet);
authRoute.get("/admin-permissions", auth_middleware_1.default.auth, auth_controller_1.default.getAllAdminPermissionGet);
authRoute.patch("/admin-permissions/update", auth_middleware_1.default.auth, auth_controller_1.default.updateAdminPermissionPatch);
exports.default = authRoute;
