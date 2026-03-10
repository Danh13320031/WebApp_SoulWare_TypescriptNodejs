"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const topic_controller_1 = __importDefault(require("../../controllers/admin/topic.controller"));
const uploadCloud_middleware_1 = __importDefault(require("../../middlewares/uploadCloud.middleware"));
const topic_validate_1 = __importDefault(require("../../validators/admin/topic.validate"));
const topicRoute = (0, express_1.Router)();
const upload = (0, multer_1.default)();
topicRoute.get("/", topic_controller_1.default.getAllTopicGet);
topicRoute.get("/create", topic_controller_1.default.createANewTopicGet);
topicRoute.post("/create", upload.single("avatar"), uploadCloud_middleware_1.default.uploadSingerField, topic_validate_1.default.createANewTopicValidate, topic_controller_1.default.createANewTopicPost);
topicRoute.get("/update/:topicId", topic_controller_1.default.getATopicByIdGet);
topicRoute.patch("/update/:topicId", upload.single("avatar"), uploadCloud_middleware_1.default.uploadSingerField, topic_validate_1.default.updateATopicByIdValidate, topic_controller_1.default.updateATopicByIdPatch);
topicRoute.patch("/soft-delete/:topicId", topic_controller_1.default.softRemoveTopicByIdPatch);
exports.default = topicRoute;
