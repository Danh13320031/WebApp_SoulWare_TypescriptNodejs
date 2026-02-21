"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const song_controller_1 = __importDefault(require("../../controllers/admin/song.controller"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const song_validate_1 = __importDefault(require("../../validators/admin/song.validate"));
const songRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
songRoute.get("", song_controller_1.default.getAllSongGet);
songRoute.get("/create", song_controller_1.default.createANewSongGet);
songRoute.post("/create", upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), uploadCloud_middleware_1.default.uploadDiffMultiField, song_validate_1.default.createANewSongValidate, song_controller_1.default.createANewSongPost);
songRoute.get("/update/:songId", song_controller_1.default.getASongByIdGet);
songRoute.patch("/update/:songId", upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), uploadCloud_middleware_1.default.uploadDiffMultiField, song_validate_1.default.updateASongByIdValidate, song_controller_1.default.updateASongByIdPatch);
songRoute.delete("/soft-delete/:songId", song_controller_1.default.softRemoveASongByIdDelete);
exports.default = songRoute;
