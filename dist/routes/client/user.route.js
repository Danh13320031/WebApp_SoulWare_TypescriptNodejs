"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = __importDefault(require("../../controllers/client/user.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/client/auth.middleware"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const user_validate_1 = __importDefault(require("../../validators/client/user.validate"));
const userRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
userRoute.get("/profile", auth_middleware_1.default.optionalAuth, auth_middleware_1.default.requiredAuth, user_controller_1.default.showProfileGet);
userRoute.patch("/profile", auth_middleware_1.default.optionalAuth, auth_middleware_1.default.requiredAuth, upload.single("avatar"), user_validate_1.default.updateProfileValidate, uploadCloud_middleware_1.default.uploadSingerField, user_controller_1.default.updateProfilePatch);
exports.default = userRoute;
