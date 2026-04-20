"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topic_controller_1 = __importDefault(require("../../controllers/client/topic.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/client/auth.middleware"));
const topicRoute = (0, express_1.Router)();
topicRoute.get("/", auth_middleware_1.default.optionalAuth, topic_controller_1.default.getAllTopicGet);
exports.default = topicRoute;
