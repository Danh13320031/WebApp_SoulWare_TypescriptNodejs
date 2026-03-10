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
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
// [GET]: /admin/topics
const getAllTopicGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.render("admin/pages/topic/create.view.ejs", {
        pageTitle: "Thêm mới chủ đề",
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
exports.topicController = {
    getAllTopicGet,
    createANewTopicGet,
    createANewTopicPost,
};
exports.default = exports.topicController;
