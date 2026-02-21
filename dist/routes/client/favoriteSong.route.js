"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoriteSong_controller_1 = __importDefault(require("../../controllers/client/favoriteSong.controller"));
const favoriteSongRoute = (0, express_1.Router)();
favoriteSongRoute.get("/", favoriteSong_controller_1.default.getAllFavoriteSongGet);
exports.default = favoriteSongRoute;
