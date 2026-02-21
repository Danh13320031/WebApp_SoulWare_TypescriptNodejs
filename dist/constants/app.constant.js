"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_PREFIX_ADMIN = exports.APP_TIMEZONE = exports.APP_PORT = exports.APP_HOST = void 0;
require("dotenv/config");
exports.APP_HOST = process.env.APP_HOST;
exports.APP_PORT = Number(process.env.APP_PORT);
exports.APP_TIMEZONE = "Asia/Ho_Chi_Minh";
exports.APP_PREFIX_ADMIN = "/admin";
