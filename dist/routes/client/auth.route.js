"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/client/auth.controller"));
const authRoute = (0, express_1.Router)();
authRoute.get("/register", auth_controller_1.default.registerGet);
authRoute.post("/register", auth_controller_1.default.registerPost);
exports.default = authRoute;
