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
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const singerGroup_model_1 = __importDefault(require("../../models/singerGroup.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
// [GET]: /admin/songs
const getAllSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
    let find = { deleted: false };
    // Handle search filter
    let keyword = "";
    let keywordRegex = new RegExp("", "i");
    let slugRegex = new RegExp("", "i");
    if (req.query.keyword)
        keyword = req.query.keyword;
    if (keyword) {
        keywordRegex = new RegExp(keyword, "i");
        slugRegex = new RegExp((0, convertTextToSlug_helper_1.default)(keyword), "i");
        find = Object.assign(Object.assign({}, find), { $or: [
                { title: { $regex: keywordRegex } },
                { slug: { $regex: slugRegex } },
            ] });
    }
    // Handle status filter
    let status = "";
    if (req.query.status)
        status = req.query.status;
    if (req.query.status === "all")
        status = "";
    const statusFilter = (0, handleStatusFilter_helper_1.default)(status);
    if (status)
        find = Object.assign(Object.assign({}, find), { status });
    // Handle singer filter
    let singer = "all";
    if (req.query.singer)
        singer = req.query.singer;
    if (singer && singer !== "all")
        find = Object.assign(Object.assign({}, find), { singers: {
                $in: [singer],
            } });
    // Handle topic filter
    let topic = "all";
    if (req.query.topic)
        topic = req.query.topic;
    if (topic && topic !== "all")
        find = Object.assign(Object.assign({}, find), { topicId: {
                _id: topic,
            } });
    // Handle sort filter
    let sort = "";
    if (req.query.sort)
        sort = req.query.sort;
    const sortFilter = (0, handleSortFilter_helper_1.default)(sort);
    // Handle pagination
    let page = 1;
    let limit = app_constant_1.APP_ADMIN_PAGINATION_LIMIT;
    let type = "";
    if (req.query.page)
        page = Number(req.query.page);
    if (req.query.limit)
        limit = Number(req.query.limit);
    if (req.query.type)
        type = req.query.type;
    const count = yield song_model_1.default.countDocuments(find);
    const pagination = yield (0, handlePagination_helper_1.default)(page, limit, type, count);
    const songList = yield song_model_1.default.find(find)
        .select("-description -audio -lyrics -slug")
        .sort(sortFilter.sortOptions)
        .populate("singers", "stageName fullName")
        .populate("singerGroups", "name")
        .populate("topicId", "title")
        .skip(pagination.skipPage)
        .limit(pagination.limitPage);
    const singerList = yield singer_model_1.default.find({
        deleted: false,
    }).select("stageName");
    const topicList = yield topic_model_1.default.find({
        deleted: false,
    }).select("title");
    res.render("admin/pages/song/song.view.ejs", {
        pageTitle: "Danh sách bài hát",
        pathname,
        songList,
        pagination,
        keyword,
        status,
        statusFilter,
        singerList,
        singer,
        topicList,
        topic,
        sort: sortFilter.sort,
    });
});
// [GET]: /admin/songs/create
const createANewSongGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
    const singerList = yield singer_model_1.default.find({
        deleted: false,
    }).select("stageName");
    const singerGroupList = yield singerGroup_model_1.default.find({
        deleted: false,
    }).select("name");
    const topicList = yield topic_model_1.default.find({
        deleted: false,
    }).select("title");
    res.render("admin/pages/song/create.view.ejs", {
        pageTitle: "Thêm mới bài hát",
        pathname,
        singerList,
        singerGroupList,
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
            singers: req.body.singers || [],
            singerGroups: req.body.singerGroups || [],
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
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let songId = "";
        if (req.params.songId)
            songId = req.params.songId;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false,
        })
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -like -listen -__v")
            .populate("singers", "stageName")
            .populate("singerGroups", "name")
            .populate("topicId", "title");
        const newSingerFromSong = song === null || song === void 0 ? void 0 : song.singers.map((singer) => singer._id.toString());
        const singerList = yield singer_model_1.default.find({
            deleted: false,
        }).select("stageName");
        const newSingerList = singerList.map((singer) => {
            if (newSingerFromSong === null || newSingerFromSong === void 0 ? void 0 : newSingerFromSong.includes(singer._id.toString())) {
                return Object.assign(Object.assign({}, singer.toObject()), { checked: true });
            }
            else {
                return Object.assign(Object.assign({}, singer.toObject()), { checked: false });
            }
        });
        const newSingerGroupFromSong = song === null || song === void 0 ? void 0 : song.singerGroups.map((singerGroup) => singerGroup._id.toString());
        const singerGroupList = yield singerGroup_model_1.default.find({
            deleted: false,
        }).select("name");
        const newSingerGroupList = singerGroupList.map((singerGroup) => {
            if (newSingerGroupFromSong === null || newSingerGroupFromSong === void 0 ? void 0 : newSingerGroupFromSong.includes(singerGroup._id.toString())) {
                return Object.assign(Object.assign({}, singerGroup.toObject()), { checked: true });
            }
            else {
                return Object.assign(Object.assign({}, singerGroup.toObject()), { checked: false });
            }
        });
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
            pathname,
            song,
            newSingerList,
            newSingerGroupList,
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
        console.log(req.body);
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
            singers: req.body.singers ? req.body.singers : [],
            singerGroups: req.body.singerGroups ? req.body.singerGroups : [],
        };
        yield song_model_1.default.updateOne({ _id: songId }, dataBodyUpdateSong);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật bài hát thành công",
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
// [PATCH]: /admin/songs/update-multi
const updateMultiSongPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ids = [];
        let type = "";
        if (req.body.ids)
            ids = req.body.ids;
        if (req.body.type)
            type = req.body.type;
        if (!ids || !type || ids.length <= 0) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Tham số không hợp lệ",
            });
            return;
        }
        switch (type) {
            case "status-active": {
                yield song_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "active" });
                break;
            }
            case "status-inactive": {
                yield song_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "inactive" });
                break;
            }
            case "soft-delete": {
                yield song_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { deleted: true });
                break;
            }
            case "hard-delete": {
                yield song_model_1.default.deleteMany({ _id: { $in: ids } });
                break;
            }
            default: {
                break;
            }
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật bài hát thành công",
            data: ids,
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
const songController = {
    getAllSongGet,
    createANewSongGet,
    createANewSongPost,
    getASongByIdGet,
    updateASongByIdPatch,
    softRemoveASongByIdDelete,
    changeStatusSongPatch,
    updateMultiSongPatch,
};
exports.default = songController;
