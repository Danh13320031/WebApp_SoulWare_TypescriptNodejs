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
exports.adminRoleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_constant_1 = require("../../constants/app.constant");
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const adminRole_model_1 = __importDefault(require("../../models/adminRole.model"));
// [GET]: /admin/admin-roles
const getAllAdminRoleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            limit = Number(req.query.limit) || app_constant_1.APP_ADMIN_PAGINATION_LIMIT;
        if (req.query.type)
            type = req.query.type;
        const count = yield adminRole_model_1.default.countDocuments(find);
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
                    { name: { $regex: keywordRegex } },
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
        const adminRoleList = yield adminRole_model_1.default.find(find).sort({
            position: "desc",
        });
        res.render("admin/pages/adminRole/adminRole.view.ejs", {
            pageTitle: "Danh sách vai trò quản trị viên",
            pathname,
            adminRoleList,
            pagination,
            keyword,
            status,
            statusFilter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - get admin role",
        });
        return;
    }
});
// [GET]: /admin/admin-roles/create
const createANewAdminRoleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        res.render("admin/pages/adminRole/create.view.ejs", {
            pageTitle: "Tạo mới vai trò quản trị viên",
            pathname,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin role",
        });
        return;
    }
});
// [POST]: /admin/admin-roles/create
const createANewAdminRolePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield adminRole_model_1.default.countDocuments();
        const dataBodyCreateAdminRole = {
            name: req.body.name || "",
            status: req.body.status || "active",
            description: req.body.description || "",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
        };
        const newAdminRole = new adminRole_model_1.default(dataBodyCreateAdminRole);
        yield newAdminRole.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới vai trò quản trị viên!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin role",
        });
        return;
    }
});
exports.adminRoleController = {
    getAllAdminRoleGet,
    createANewAdminRoleGet,
    createANewAdminRolePost,
};
exports.default = exports.adminRoleController;
