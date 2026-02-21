"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const song_controller_1 = __importDefault(require("../../controllers/client/song.controller"));
const songRoute = (0, express_1.Router)();
songRoute.get("/:topicSlug", song_controller_1.default.getAllSongGet);
songRoute.get("/detail/:songSlug", song_controller_1.default.getOneSongGet);
songRoute.patch("/like/:type/:songId", song_controller_1.default.likeSongPatch);
songRoute.patch("/favorite/:type/:songId", song_controller_1.default.favoriteSongPatch);
songRoute.get("/listen/:songId", song_controller_1.default.listenToSongOncePatch);
exports.default = songRoute;
