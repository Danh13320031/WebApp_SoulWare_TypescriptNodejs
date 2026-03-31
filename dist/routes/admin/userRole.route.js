"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRole_controller_1 = __importDefault(require("../../controllers/admin/userRole.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const userRoleRoute = (0, express_1.Router)();
userRoleRoute.get("/", auth_middleware_1.default.auth, userRole_controller_1.default.getAllUserRoleGet);
exports.default = userRoleRoute;
