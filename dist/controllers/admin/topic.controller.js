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
exports.topicController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_constant_1 = require("../../constants/app.constant");
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
// [GET]: /admin/topics
const getAllTopicGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
    let find = { deleted: false };
    // Handle pagination
    let page = 1;
    let limit = app_constant_1.APP_ADMIN_PAGINATION_LIMIT;
    let type = "";
    if (req.query.page)
        page = Number(req.query.page);
    if (req.query.limit)
        limit = Number(req.query.limit) || app_constant_1.APP_ADMIN_PAGINATION_LIMIT;
    if (req.query.type)
        type = req.query.type;
    const count = yield topic_model_1.default.countDocuments(find);
    const pagination = yield (0, handlePagination_helper_1.default)(page, limit, type, count);
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
    // Handle sort filter
    let sort = "";
    if (req.query.sort)
        sort = req.query.sort;
    const sortFilter = (0, handleSortFilter_helper_1.default)(sort);
    const topicList = yield topic_model_1.default.find(find)
        .select("-deleted -description")
        .sort(sortFilter.sortOptions)
        .skip(pagination.skipPage)
        .limit(pagination.limitPage);
    res.render("admin/pages/topic/topic.view.ejs", {
        pageTitle: "Danh sách chủ đề",
        pathname,
        topicList,
        pagination,
        keyword,
        status,
        statusFilter,
        sort: sortFilter.sort,
    });
});
// [GET]: /admin/topics/create
const createANewTopicGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
    res.render("admin/pages/topic/create.view.ejs", {
        pageTitle: "Thêm mới chủ đề",
        pathname,
    });
});
// [POST]: /admin/songs/create
const createANewTopicPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield topic_model_1.default.countDocuments();
        let avatar = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        const dataBodyCreateTopic = {
            title: req.body.title ? req.body.title : "",
            avatar: avatar,
            description: req.body.description || "",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
            status: req.body.status || "active",
        };
        const newSong = new topic_model_1.default(dataBodyCreateTopic);
        yield newSong.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo chủ đề thành công!",
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
// [GET]: /admin/topics/update/:topicId
const getATopicByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let topicId = "";
        if (req.params.topicId)
            topicId = req.params.topicId;
        const topic = yield topic_model_1.default.findOne({
            _id: topicId,
            deleted: false,
        }).select("-deleted -deletedAt -createdAt -updatedAt -slug -__v");
        if (!topic) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy chủ đề",
            });
            return;
        }
        res.render("admin/pages/topic/update.view.ejs", {
            pageTitle: `Chỉnh sửa chủ đề ${topic.title}`,
            pathname,
            topic,
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
// [PATCH]: /admin/topics/update/:topicId
const updateATopicByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicId = req.params.topicId;
        const topic = yield topic_model_1.default.findOne({
            _id: topicId,
            deleted: false,
        });
        if (!topic) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy chủ đề",
            });
            return;
        }
        if (req.body.avatar)
            topic.avatar = req.body.avatar;
        const dataBodyupdateTopic = {
            title: req.body.title ? req.body.title : topic.title,
            avatar: req.body.avatar ? req.body.avatar : topic.avatar,
            description: req.body.description
                ? req.body.description
                : topic.description,
            position: req.body.position ? Number(req.body.position) : topic.position,
            status: req.body.status ? req.body.status : topic.status,
        };
        yield topic_model_1.default.updateOne({ _id: topicId }, dataBodyupdateTopic);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật chủ đề thành công!",
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
// [PATCH]: /admin/topics/soft-delete/topicId
const softRemoveTopicByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicId = req.params.topicId;
        const topic = yield topic_model_1.default.findOne({
            _id: topicId,
            deleted: false,
        });
        if (!topic) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy chủ đề",
            });
            return;
        }
        yield topic_model_1.default.updateOne({ _id: topicId }, { deleted: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Xóa chủ đề thành công",
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
// [PATCH]: /admin/topics/change-status/:topicId/:status
const changeStatusTopicPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicId = req.params.topicId;
        const topicStatus = req.params.status;
        const topic = yield topic_model_1.default.findOne({
            _id: topicId,
            deleted: false,
        });
        if (!topic) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy chủ đề",
            });
            return;
        }
        yield topic_model_1.default.findOneAndUpdate({ _id: topicId }, { status: topicStatus }).select("_id");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật trạng thái chủ đề thành công!",
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
// [PÂTCH]: /admin/topics/update-multi
const updateMultiTopicPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            case "status-active":
                yield topic_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "active" });
                break;
            case "status-inactive":
                yield topic_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "inactive" });
                break;
            case "status-deleted":
                yield topic_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { deleted: true });
                break;
            default:
                break;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật chủ đề thành cong",
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
exports.topicController = {
    getAllTopicGet,
    createANewTopicGet,
    createANewTopicPost,
    getATopicByIdGet,
    updateATopicByIdPatch,
    softRemoveTopicByIdPatch,
    changeStatusTopicPatch,
    updateMultiTopicPatch,
};
exports.default = exports.topicController;
