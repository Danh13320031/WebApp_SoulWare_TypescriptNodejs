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
// [GET]: /admin/singer-groups
const singerGroupGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        const count = yield singerGroup_model_1.default.countDocuments(find);
        const pagination = yield (0, handlePagination_helper_1.default)(page, limit, type, count);
        const singerGroupList = yield singerGroup_model_1.default.find(find)
            .select("-deleted -createdAt -deletedAt -updatedAt -slug -__v")
            .sort(sortFilter.sortOptions)
            .populate("singers", "fullName stageName")
            .skip(pagination.skipPage)
            .limit(pagination.limitPage);
        res.render("admin/pages/singerGroup/singerGroup.view.ejs", {
            pageTitle: "Danh sách nhóm ca sĩ",
            pathname,
            pagination,
            singerGroupList,
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
            message: "Server error - singerGroupGet",
        });
        return;
    }
});
// [GET]: /admin/singer-groups/create
const createANewSingerGroupGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        const singerList = yield singer_model_1.default.find(find).select("stageName");
        res.render("admin/pages/singerGroup/create.view.ejs", {
            pageTitle: "Tạo mới nhóm ca sĩ",
            pathname,
            singerList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSingerGroupGet",
        });
        return;
    }
});
// [POST]: /admin/singer-groups/create
const createANewSingerGroupPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield singerGroup_model_1.default.countDocuments();
        let avatar = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        const dataBodyCreateSingerGroup = {
            avatar: avatar ? avatar : "",
            name: req.body.name ? req.body.name : "",
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : "active",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
            singers: req.body.singers ? req.body.singers : [],
        };
        const newSingerGroup = new singerGroup_model_1.default(dataBodyCreateSingerGroup);
        yield newSingerGroup.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới nhóm ca sĩ thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSingerGroupPost",
        });
        return;
    }
});
// [GET]: /admin/singer-groups/update/:singerGroupId
const getASingerGroupByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        let singerGroupId = "";
        if (req.params.singerGroupId)
            singerGroupId = req.params.singerGroupId;
        const singerGroup = yield singerGroup_model_1.default.findOne(Object.assign({ _id: singerGroupId }, find))
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -__v")
            .populate("singers", "stageName");
        if (!singerGroup) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy nhóm ca sĩ",
            });
            return;
        }
        const singerList = yield singer_model_1.default.find(find).select("stageName");
        const newSingerFromGroup = singerGroup.singers.map((singer) => singer._id.toString());
        const newSingerList = singerList.map((singer) => {
            if (newSingerFromGroup.includes(singer._id.toString())) {
                return Object.assign(Object.assign({}, singer), { checked: true });
            }
            else {
                return Object.assign(Object.assign({}, singer), { checked: false });
            }
        });
        res.render("admin/pages/singerGroup/update.view.ejs", {
            pageTitle: "Cập nhật nhóm ca sĩ",
            singerGroup,
            pathname,
            newSingerList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - getASingerGroupByIdGet",
        });
        return;
    }
});
// [PATCH]: /admin/singer-groups/update/:singerGroupId
const updateASingerGroupByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let singerGroupId = "";
        let avatar = "";
        if (req.params.singerGroupId)
            singerGroupId = req.params.singerGroupId;
        if (req.body.avatar)
            avatar = req.body.avatar;
        const singerGroup = yield singerGroup_model_1.default.findOne({
            _id: singerGroupId,
            deleted: false,
        });
        if (!singerGroup) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy nhóm ca sĩ",
            });
            return;
        }
        const dataBodyUpdateSingerGroup = {
            avatar: avatar ? avatar : singerGroup.avatar,
            name: req.body.name ? req.body.name : null,
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : null,
            singers: req.body.singers ? req.body.singers : null,
        };
        yield singerGroup_model_1.default.updateOne({ _id: singerGroupId }, { $set: dataBodyUpdateSingerGroup });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật nhóm ca sĩ thành cong!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - updateASingerGroupByIdPatch",
        });
        return;
    }
});
const singerGroupController = {
    singerGroupGet,
    createANewSingerGroupGet,
    createANewSingerGroupPost,
    getASingerGroupByIdGet,
    updateASingerGroupByIdPatch,
};
exports.default = singerGroupController;
