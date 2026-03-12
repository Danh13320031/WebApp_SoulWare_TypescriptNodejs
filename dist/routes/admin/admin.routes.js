"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../../controllers/admin/admin.controller"));
const adminRoute = (0, express_1.Router)();
adminRoute.get("/", admin_controller_1.default.adminGet);
exports.default = adminRoute;
