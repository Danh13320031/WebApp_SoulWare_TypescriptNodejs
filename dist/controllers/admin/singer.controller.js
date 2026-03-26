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
// [GET]: /admin/singers
const getAllSingerGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
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
        const count = yield singer_model_1.default.countDocuments(find);
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
                    { fullName: { $regex: keywordRegex } },
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
        const singerList = yield singer_model_1.default.find(find)
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -__v")
            .sort(sortFilter.sortOptions)
            .skip(pagination.skipPage)
            .limit(pagination.limitPage);
        res.render("admin/pages/singer/singer.view.ejs", {
            pageTitle: "Danh sách ca sĩ",
            pathname,
            singerList,
            pagination,
            keyword,
            status,
            statusFilter,
            sort: sortFilter.sort,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - getAllSinger",
        });
        return;
    }
});
// [GET]: /admin/singers/create
const createANewSingerGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        res.render("admin/pages/singer/create.view.ejs", {
            pageTitle: "Tạo mới ca sĩ",
            pathname,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSinger",
        });
        return;
    }
});
// [POST]: /admin/singers/create
const createANewSingerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield singer_model_1.default.countDocuments();
        let avatar = "";
        let fullName = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        if (req.body.name)
            fullName = req.body.name;
        const dataBodyCreateSinger = {
            avatar: avatar ? avatar : "",
            fullName: fullName ? fullName : "",
            stageName: req.body.stageName ? req.body.stageName : "",
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : "active",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
        };
        const newSinger = new singer_model_1.default(dataBodyCreateSinger);
        yield newSinger.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới ca sĩ thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSinger",
        });
        return;
    }
});
// [GET]: /admin/singers/update/:singerId
const getASingerByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let singerId = "";
        if (req.params.singerId)
            singerId = req.params.singerId;
        const singer = yield singer_model_1.default.findOne({
            _id: singerId,
            deleted: false,
        }).select("-deleted -deletedAt -createdAt -updatedAt -slug -__v");
        if (!singer) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy ca sĩ",
            });
            return;
        }
        res.render("admin/pages/singer/update.view.ejs", {
            pageTitle: "Cập nhật ca sĩ",
            pathname,
            singer,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - getASingerById",
        });
        return;
    }
});
// [PATCH]: /admin/singers/update/:singerId
const updateASingerByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let singerId = "";
        let avatar = "";
        let fullName = "";
        if (req.params.singerId)
            singerId = req.params.singerId;
        if (req.body.name)
            fullName = req.body.name;
        if (req.body.avatar)
            avatar = req.body.avatar;
        const singer = yield singer_model_1.default.findOne({
            _id: singerId,
            deleted: false,
        });
        if (!singer) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy ca sĩ",
            });
            return;
        }
        const dataBodyUpdateSinger = {
            fullName: fullName ? fullName : singer.fullName,
            stageName: req.body.stageName ? req.body.stageName : singer.stageName,
            avatar: avatar ? avatar : singer.avatar,
            description: req.body.description
                ? req.body.description
                : singer.description,
            status: req.body.status ? req.body.status : singer.status,
            position: req.body.position ? Number(req.body.position) : singer.position,
        };
        yield singer_model_1.default.updateOne({ _id: singerId }, dataBodyUpdateSinger);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật ca sĩ thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - updateASingerById",
        });
        return;
    }
});
const singerController = {
    getAllSingerGet,
    createANewSingerGet,
    createANewSingerPost,
    getASingerByIdGet,
    updateASingerByIdPatch,
};
exports.default = singerController;
