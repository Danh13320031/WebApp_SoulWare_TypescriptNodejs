"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const singer_controller_1 = __importDefault(require("../../controllers/admin/singer.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const singerRoute = (0, express_1.Router)();
singerRoute.get("/", auth_middleware_1.default.auth, singer_controller_1.default.getAllSingerGet);
exports.default = singerRoute;
