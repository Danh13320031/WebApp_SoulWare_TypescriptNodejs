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
const app_constant_1 = require("../../constants/app.constant");
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
// [GET]: /admin/songs
const getAllSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = 1;
    let limit = app_constant_1.APP_ADMIN_PAGINATION_LIMIT;
    let type = "";
    if (req.query.page)
        page = Number(req.query.page);
    if (req.query.limit)
        limit = Number(req.query.limit);
    if (req.query.type)
        type = req.query.type;
    const pagination = yield (0, handlePagination_helper_1.default)(page, limit, type);
    const songList = yield song_model_1.default.find({
        deleted: false,
    })
        .select("-deleted -description -audio -lyrics -slug")
        .sort({ position: "desc" })
        .populate("singerId", "stageName")
        .populate("topicId", "title")
        .skip(pagination.skipPage)
        .limit(pagination.limitPage);
    res.render("admin/pages/song/song.view.ejs", {
        pageTitle: "Danh sách bài hát",
        songList,
        pagination,
    });
});
// [GET]: /admin/songs/create
const createANewSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singerList = yield singer_model_1.default.find({
        deleted: false,
    }).select("stageName");
    const topicList = yield topic_model_1.default.find({
        deleted: false,
    }).select("title");
    res.render("admin/pages/song/create.view.ejs", {
        pageTitle: "Thêm mới bài hát",
        singerList,
        topicList,
    });
});
// [POST]: /admin/songs/create
const createANewSongPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield song_model_1.default.countDocuments();
        let avatar = "";
        let audio = "";
        if (req.body.avatar)
            avatar = req.body.avatar[0];
        if (req.body.audio)
            audio = req.body.audio[0];
        const dataBodyCreateSong = {
            title: req.body.title ? req.body.title : "",
            avatar: avatar,
            description: req.body.description || "",
            lyrics: req.body.lyrics || "",
            audio: audio,
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
            status: req.body.status || "active",
            topicId: req.body.topicId || "",
            singerId: req.body.singerId || "",
        };
        const newSong = new song_model_1.default(dataBodyCreateSong);
        yield newSong.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo bài hát thành công!",
        });
        return;
    }
    catch (error) {
        console.error("Lỗi hệ thống::: ", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi hệ thống",
        });
        return;
    }
});
// [GET]: /admin/songs/update/:songId
const getASongByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let songId = "";
        if (req.params.songId)
            songId = req.params.songId;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false,
        })
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -like -listen -__v")
            .populate("singerId", "stageName")
            .populate("topicId", "title");
        const singerList = yield singer_model_1.default.find({
            deleted: false,
        }).select("stageName");
        const topicList = yield topic_model_1.default.find({
            deleted: false,
        }).select("title");
        if (!song) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy bài hát",
            });
            return;
        }
        res.render("admin/pages/song/update.view.ejs", {
            pageTitle: `Chỉnh sửa bài hát ${song.title}`,
            song,
            singerList,
            topicList,
        });
    }
    catch (error) {
        console.error("Lỗi hệ thống::: ", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi hệ thống",
        });
        return;
    }
});
// [PATCH]: /admin/songs/update/:songId
const updateASongByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.songId;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false,
        });
        if (!song) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy bài hát",
            });
            return;
        }
        if (req.body.avatar)
            song.avatar = req.body.avatar[0];
        if (req.body.audio)
            song.audio = req.body.audio[0];
        const dataBodyUpdateSong = {
            title: req.body.title ? req.body.title : song.title,
            avatar: req.body.avatar ? req.body.avatar[0] : song.avatar,
            description: req.body.description
                ? req.body.description
                : song.description,
            lyrics: req.body.lyrics ? req.body.lyrics : song.lyrics,
            audio: req.body.audio ? req.body.audio[0] : song.audio,
            position: req.body.position ? Number(req.body.position) : song.position,
            status: req.body.status ? req.body.status : song.status,
            topicId: req.body.topicId ? req.body.topicId : song.topicId,
            singerId: req.body.singerId ? req.body.singerId : song.singerId,
        };
        yield song_model_1.default.updateOne({ _id: songId }, dataBodyUpdateSong);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật bài hát thành công",
        });
    }
    catch (error) {
        console.error("Lỗi hệ thống::: ", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi hệ thống",
        });
        return;
    }
});
// [DELETE]: /admin/songs/soft-delete/:songId
const softRemoveASongByIdDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.songId;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false,
        });
        if (!song) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy bài hát",
            });
            return;
        }
        yield song_model_1.default.updateOne({ _id: songId }, { deleted: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Xoa bài hát thành công",
        });
    }
    catch (error) {
        console.error("Lỗi hệ thống::: ", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi hệ thống",
        });
        return;
    }
});
// [PATCH]: /admin/songs/change-status/:songId/:status
const changeStatusSongPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.songId;
        const songStatus = req.params.status;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false,
        });
        if (!song) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy bài hát",
            });
            return;
        }
        yield song_model_1.default.findOneAndUpdate({ _id: songId }, {
            status: songStatus,
        }).select("_id");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Đổi trạng thái thành công!",
        });
    }
    catch (error) {
        console.error("Lỗi hệ thống::: ", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi hệ thống",
        });
        return;
    }
});
const songController = {
    getAllSongGet,
    createANewSongGet,
    createANewSongPost,
    getASongByIdGet,
    updateASongByIdPatch,
    softRemoveASongByIdDelete,
    changeStatusSongPatch,
};
exports.default = songController;
