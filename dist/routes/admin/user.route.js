"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = __importDefault(require("../../controllers/admin/user.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const user_validate_1 = __importDefault(require("../../validators/admin/user.validate"));
const userRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
userRoute.get("/", auth_middleware_1.default.auth, user_controller_1.default.getAllUserGet);
userRoute.get("/create", auth_middleware_1.default.auth, user_controller_1.default.createANewUserGet);
userRoute.post("/create", auth_middleware_1.default.auth, upload.single("avatar"), uploadCloud_middleware_1.default.uploadSingerField, user_validate_1.default.createANewUserValidate, user_controller_1.default.createANewUserPost);
userRoute.get("/update/:userId", auth_middleware_1.default.auth, user_controller_1.default.getAUserByIdGet);
userRoute.patch("/update/:userId", auth_middleware_1.default.auth, upload.single("avatar"), uploadCloud_middleware_1.default.uploadSingerField, user_validate_1.default.updateAUserByIdValidate, user_controller_1.default.updateAUserByIdPatch);
exports.default = userRoute;
