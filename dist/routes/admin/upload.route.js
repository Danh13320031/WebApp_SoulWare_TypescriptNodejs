"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = __importDefault(require("../../controllers/admin/upload.controller"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const uploadRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
uploadRoute.post("/", upload.single("file"), uploadCloud_middleware_1.default.uploadSingerField, upload_controller_1.default.uploadImageFromTinyMce);
exports.default = uploadRoute;
