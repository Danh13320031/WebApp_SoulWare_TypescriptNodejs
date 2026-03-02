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
const http_status_codes_1 = require("http-status-codes");
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const song_model_1 = __importDefault(require("../../models/song.model"));
// [GET]: /search/:type
const getAllSearchResultGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const keyword = req.query.keyword || "";
    let newSearchedSongList = [];
    if (keyword) {
        const keywordRegex = new RegExp(keyword, "i");
        const slug = (0, convertTextToSlug_helper_1.default)(keyword);
        const slugRegex = new RegExp(slug, "i");
        const searchedSongList = yield song_model_1.default.find({
            $or: [
                { title: { $regex: keywordRegex } },
                { slug: { $regex: slugRegex } },
            ],
            status: "active",
            deleted: false,
        })
            .select("title avatar singerId slug like")
            .populate("singerId", "stageName slug")
            .populate("topicId", "title slug");
        newSearchedSongList = searchedSongList;
    }
    switch (type) {
        case "result":
            res.render("client/pages/search/search.view.ejs", {
                pageTitle: `Kết quả tìm kiếm: ${keyword}`,
                keyword,
                newSearchedSongList,
            });
            break;
        case "suggest":
            res.json({
                code: http_status_codes_1.StatusCodes.OK,
                status: "Success",
                data: newSearchedSongList,
            });
            break;
        default:
            break;
    }
});
const searchController = {
    getAllSearchResultGet,
};
exports.default = searchController;
