"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminRole_controller_1 = __importDefault(require("../../controllers/admin/adminRole.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const adminRole_validate_1 = __importDefault(require("../../validators/admin/adminRole.validate"));
const adminRoleRoute = (0, express_1.Router)();
adminRoleRoute.get("/", auth_middleware_1.default.auth, adminRole_controller_1.default.getAllAdminRoleGet);
adminRoleRoute.get("/create", auth_middleware_1.default.auth, adminRole_controller_1.default.createANewAdminRoleGet);
adminRoleRoute.post("/create", auth_middleware_1.default.auth, adminRole_validate_1.default.createANewAdminRoleValidate, adminRole_controller_1.default.createANewAdminRolePost);
adminRoleRoute.get("/update/:adminRoleId", auth_middleware_1.default.auth, adminRole_controller_1.default.getAAdminRoleByIdGet);
adminRoleRoute.patch("/update/:adminRoleId", auth_middleware_1.default.auth, adminRole_validate_1.default.updateAdminRolePatchValidate, adminRole_controller_1.default.updateAdminRolePatch);
adminRoleRoute.patch("/soft-delete/:adminRoleId", auth_middleware_1.default.auth, adminRole_controller_1.default.softRemoveAdminRoleByIdPatch);
adminRoleRoute.patch("/change-status/:adminRoleId/:status", auth_middleware_1.default.auth, adminRole_controller_1.default.changeStatusAdminRolePatch);
adminRoleRoute.patch("/update-multi", auth_middleware_1.default.auth, adminRole_controller_1.default.updateMultiAdminRolePatch);
exports.default = adminRoleRoute;
