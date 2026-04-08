"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const song_controller_1 = __importDefault(require("../../controllers/admin/song.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const song_validate_1 = __importDefault(require("../../validators/admin/song.validate"));
const songRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
songRoute.get("", auth_middleware_1.default.auth, song_controller_1.default.getAllSongGet);
songRoute.get("/create", auth_middleware_1.default.auth, song_controller_1.default.createANewSongGet);
songRoute.post("/create", auth_middleware_1.default.auth, upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), song_validate_1.default.createANewSongValidate, uploadCloud_middleware_1.default.uploadDiffMultiField, song_controller_1.default.createANewSongPost);
songRoute.get("/update/:songId", auth_middleware_1.default.auth, song_controller_1.default.getASongByIdGet);
songRoute.patch("/update/:songId", auth_middleware_1.default.auth, upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), song_validate_1.default.updateASongByIdValidate, uploadCloud_middleware_1.default.uploadDiffMultiField, song_controller_1.default.updateASongByIdPatch);
songRoute.patch("/soft-delete/:songId", auth_middleware_1.default.auth, song_controller_1.default.softRemoveASongByIdDelete);
songRoute.patch("/change-status/:songId/:status", auth_middleware_1.default.auth, song_controller_1.default.changeStatusSongPatch);
songRoute.patch("/update-multi", auth_middleware_1.default.auth, song_controller_1.default.updateMultiSongPatch);
exports.default = songRoute;
