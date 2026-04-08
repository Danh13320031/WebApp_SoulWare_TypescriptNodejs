"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const http_status_codes_1 = require("http-status-codes");
// [GET]: /topics
const getAllTopicGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = { deleted: false, status: "active" };
        const topicList = yield topic_model_1.default.find(find);
        const songList = yield song_model_1.default.find(find)
            .select("title avatar singers singerGroups slug topicId")
            .populate("singers", "stageName slug")
            .populate("topicId", "title slug")
            .populate("singerGroups", "name slug");
        res.render("client/pages/topic/topic.view.ejs", {
            pageTitle: "Chủ đề bài hát",
            topicList,
            songList,
            keyword: "",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - Cannot get topic list",
        });
        return;
    }
});
const topicController = {
    getAllTopicGet,
};
exports.default = topicController;
