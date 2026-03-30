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
const favoriteSong_model_1 = __importDefault(require("../../models/favoriteSong.model"));
// [GET]: /favorite-songs/
const getAllFavoriteSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteSongList = yield favoriteSong_model_1.default.find({
        // userId: req.user?._id, // Khi có xác thực người dùng thì tìm bài hát thích của tôi
        status: "active",
        deleted: false,
    }).populate({
        path: "songId",
        select: "title avatar singers singerGroups slug like",
        populate: [
            { path: "singers", select: "stageName slug" },
            { path: "singerGroups", select: "name slug" },
        ],
    });
    res.render("client/pages/favoriteSong/favoriteSong.view.ejs", {
        pageTitle: "Playlist yêu thích của tôi",
        favoriteSongList,
        keyword: "",
    });
});
const favoriteSongController = {
    getAllFavoriteSongGet,
};
exports.default = favoriteSongController;
