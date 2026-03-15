"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminRole_controller_1 = __importDefault(require("../../controllers/admin/adminRole.controller"));
const adminRole_validate_1 = __importDefault(require("../../validators/admin/adminRole.validate"));
const adminRoleRoute = (0, express_1.Router)();
adminRoleRoute.get("/", adminRole_controller_1.default.getAllAdminRoleGet);
adminRoleRoute.get("/create", adminRole_controller_1.default.createANewAdminRoleGet);
adminRoleRoute.post("/create", adminRole_validate_1.default.createANewAdminRoleValidate, adminRole_controller_1.default.createANewAdminRolePost);
adminRoleRoute.get("/update/:adminRoleId", adminRole_controller_1.default.getAAdminRoleByIdGet);
adminRoleRoute.patch("/update/:adminRoleId", adminRole_validate_1.default.updateAdminRolePatchValidate, adminRole_controller_1.default.updateAdminRolePatch);
exports.default = adminRoleRoute;
