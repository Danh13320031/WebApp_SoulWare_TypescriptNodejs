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
const favoriteSong_model_1 = __importDefault(require("../../models/favoriteSong.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
// [GET]: /songs/:topicSlug
const getAllSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicSlug = req.params.topicSlug;
    const topic = yield topic_model_1.default.findOne({
        slug: topicSlug,
        status: "active",
        deleted: false,
    });
    const topicTitle = topic === null || topic === void 0 ? void 0 : topic.title;
    const songList = yield song_model_1.default.find({
        topicId: topic === null || topic === void 0 ? void 0 : topic._id,
        status: "active",
        deleted: false,
    })
        .select("title avatar singerId slug like")
        .populate("singerId", "stageName slug");
    res.render("client/pages/song/song.view.ejs", {
        pageTitle: `Danh sách nhạc ${topicTitle}`,
        songList,
        keyword: "",
    });
});
// [GET]: /songs/detail/:songSlug
const getOneSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songSlug = req.params.songSlug;
    const song = yield song_model_1.default.findOne({
        slug: songSlug,
        status: "active",
        deleted: false,
    })
        .select("-deletedAt -deleted -status -position -__v")
        .populate("singerId", "stageName slug")
        .populate("topicId", "title slug");
    const favoritedSong = yield favoriteSong_model_1.default.findOne({
        songId: song === null || song === void 0 ? void 0 : song._id,
    });
    res.render("client/pages/song/detail.view.ejs", {
        pageTitle: `Bài hát ${song === null || song === void 0 ? void 0 : song.title}`,
        song,
        favorited: favoritedSong ? true : false,
        keyword: "",
    });
});
// [PATCH]: /songs/like/:type/:songId
const likeSongPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const type = req.params.type;
    const song = yield song_model_1.default.findOne({
        _id: songId,
        status: "active",
        deleted: false,
    });
    if (!song) {
        res.json({
            code: http_status_codes_1.StatusCodes.NOT_FOUND,
            status: "Fail",
            message: "Không tìm thấy bài hát",
        });
        return;
    }
    if (type === "yes")
        song.like += 1;
    else if (type === "no")
        song.like -= 1;
    yield song.save();
    const data = {
        like: song.like,
    };
    res.json({
        code: http_status_codes_1.StatusCodes.OK,
        status: "Success",
        message: "Thích bài hát thành công",
        data: data,
    });
    return;
});
// [PATCH]: /songs/favorite/:type/:songId
const favoriteSongPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const type = req.params.type;
    switch (type) {
        case "yes":
            const favoriteSong = yield favoriteSong_model_1.default.findOne({
                songId: songId,
                status: "active",
                deleted: false,
            }).select("songId");
            if (!favoriteSong)
                yield favoriteSong_model_1.default.create({ songId: songId });
            res.json({
                code: http_status_codes_1.StatusCodes.OK,
                status: "Success",
                message: "Yêu thích bài hát thành công",
            });
            break;
        case "no":
            yield favoriteSong_model_1.default.deleteOne({ songId: songId });
            res.json({
                code: http_status_codes_1.StatusCodes.OK,
                status: "Success",
                message: "Bỏ yêu thích bài hát thành công",
            });
            break;
        default:
            break;
    }
});
// [PATCH]: /songs/listen/:songId
const listenToSongOncePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const song = yield song_model_1.default.findOne({
        _id: songId,
        status: "active",
        deleted: false,
    });
    if (!song) {
        res.json({
            code: http_status_codes_1.StatusCodes.NOT_FOUND,
            status: "Fail",
            message: "Không tìm thấy bài hát",
        });
        return;
    }
    song.listen += 1;
    yield song.save();
    res.json({
        code: http_status_codes_1.StatusCodes.OK,
        status: "Success",
        message: "Nghe bài hát thành công",
        data: {
            listen: song.listen,
        },
    });
    return;
});
const songController = {
    getAllSongGet,
    getOneSongGet,
    likeSongPatch,
    favoriteSongPatch,
    listenToSongOncePatch,
};
exports.default = songController;
