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
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
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
        // Handle sort filter
        let sort = "";
        if (req.query.sort)
            sort = req.query.sort;
        const sortFilter = (0, handleSortFilter_helper_1.default)(sort);
        const adminRoleList = yield adminRole_model_1.default.find(find)
            .select("-deleted -deletedAt -updatedAt -createdAt -__v")
            .sort(sortFilter.sortOptions)
            .skip(pagination.skipPage)
            .limit(pagination.limitPage);
        res.render("admin/pages/adminRole/adminRole.view.ejs", {
            pageTitle: "Danh sách vai trò quản trị viên",
            pathname,
            adminRoleList,
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
// [GET]: /admin/admin-roles/update/:adminRoleId
const getAAdminRoleByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        const adminRoleId = req.params.adminRoleId;
        const adminRole = yield adminRole_model_1.default.findOne({
            _id: adminRoleId,
            deleted: false,
        }).select("-deleted -deletedAt -createdAt -updatedAt -__v");
        if (!adminRole) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy vai trò quản trị viên",
            });
            return;
        }
        res.render("admin/pages/adminRole/update.view.ejs", {
            pageTitle: `Cập nhật vai trò "${adminRole.name}"`,
            pathname,
            adminRole,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - get admin role by id",
        });
        return;
    }
});
// [PATCH]: /admin/admin-roles/update/:adminRoleId
const updateAdminRolePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminRoleId = req.params.adminRoleId;
        if (!adminRoleId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Không tìm thấy vai trò quản trị viên",
            });
            return;
        }
        const dataBodyUpdateAdminRole = {
            name: req.body.name || "",
            status: req.body.status || "active",
            description: req.body.description || "",
        };
        yield adminRole_model_1.default.findOneAndUpdate({ _id: adminRoleId }, dataBodyUpdateAdminRole, { new: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật vai trò quản trị viên thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update admin role",
        });
        return;
    }
});
// [PATCH]: /admin/admin-roles/soft-delete/:adminRoleId
const softRemoveAdminRoleByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminRoleId = req.params.adminRoleId;
        if (!adminRoleId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Không tìm thấy vai trò quản trị viên",
            });
            return;
        }
        yield adminRole_model_1.default.findOneAndUpdate({ _id: adminRoleId }, { deleted: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Xóa vai trò quản trị viên thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - soft remove admin role by id",
        });
        return;
    }
});
// [PATCH]: /admin/admin-roles/change-status/:adminRoleId/:status
const changeStatusAdminRolePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminRoleId = req.params.adminRoleId;
        const adminRoleStatus = req.params.status;
        if (!adminRoleId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Không tìm thấy vai trò!",
            });
            return;
        }
        yield adminRole_model_1.default.findOneAndUpdate({ _id: adminRoleId }, { status: adminRoleStatus });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật trạng thái vai trò thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - change status admin role",
        });
        return;
    }
});
// [PATCH]: /admin/admin-roles/update-multi
const updateMultiAdminRolePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                yield adminRole_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "active" });
                break;
            case "status-inactive":
                yield adminRole_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "inactive" });
                break;
            case "soft-delete":
                yield adminRole_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { deleted: true });
                break;
            case "hard-delete":
                yield adminRole_model_1.default.deleteMany({ _id: { $in: ids } });
                break;
            default:
                break;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật vai trò thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update multi admin role",
        });
        return;
    }
});
exports.adminRoleController = {
    getAllAdminRoleGet,
    createANewAdminRoleGet,
    createANewAdminRolePost,
    getAAdminRoleByIdGet,
    updateAdminRolePatch,
    softRemoveAdminRoleByIdPatch,
    changeStatusAdminRolePatch,
    updateMultiAdminRolePatch,
};
exports.default = exports.adminRoleController;
