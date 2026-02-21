"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = __importDefault(require("../../controllers/client/search.controller"));
const searchRoute = (0, express_1.Router)();
searchRoute.get("/:type", search_controller_1.default.getAllSearchResultGet);
exports.default = searchRoute;
