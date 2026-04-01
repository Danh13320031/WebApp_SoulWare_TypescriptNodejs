"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRole_controller_1 = __importDefault(require("../../controllers/admin/userRole.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const userRole_validate_1 = __importDefault(require("../../validators/admin/userRole.validate"));
const userRoleRoute = (0, express_1.Router)();
userRoleRoute.get("/", auth_middleware_1.default.auth, userRole_controller_1.default.getAllUserRoleGet);
userRoleRoute.get("/create", auth_middleware_1.default.auth, userRole_controller_1.default.createANewUserRoleGet);
userRoleRoute.post("/create", auth_middleware_1.default.auth, userRole_validate_1.default.createANewUserRoleValidate, userRole_controller_1.default.createANewUserRolePost);
userRoleRoute.get("/update/:userRoleId", auth_middleware_1.default.auth, userRole_controller_1.default.getAUserRoleByIdGet);
userRoleRoute.patch("/update/:userRoleId", auth_middleware_1.default.auth, userRole_validate_1.default.updateUserRoleValidate, userRole_controller_1.default.updateUserRolePatch);
userRoleRoute.patch("/soft-delete/:userRoleId", auth_middleware_1.default.auth, userRole_controller_1.default.softRemoveUserRoleByIdPatch);
userRoleRoute.patch("/change-status/:userRoleId/:status", auth_middleware_1.default.auth, userRole_controller_1.default.changeStatusUserRolePatch);
exports.default = userRoleRoute;
