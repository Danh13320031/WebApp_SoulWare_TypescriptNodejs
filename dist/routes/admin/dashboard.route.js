"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../../controllers/admin/dashboard.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const dashboardRoute = (0, express_1.Router)();
dashboardRoute.get("/", auth_middleware_1.default.auth, dashboard_controller_1.default.dashboardGet);
exports.default = dashboardRoute;
