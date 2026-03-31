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
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_constant_1 = require("../../constants/app.constant");
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
const hashPassword_helper_1 = __importDefault(require("../../helpers/hashPassword.helper"));
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const adminRole_model_1 = __importDefault(require("../../models/adminRole.model"));
// [GET]: /admin/admin
const adminGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const count = yield admin_model_1.default.countDocuments(find);
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
    // Handle singer filter
    let role = "all";
    if (req.query.role)
        role = req.query.role;
    if (role && role !== "all")
        find = Object.assign(Object.assign({}, find), { roleId: {
                _id: role,
            } });
    const adminList = yield admin_model_1.default.find(find)
        .select("-deleted -deletedAt")
        .sort(sortFilter.sortOptions)
        .populate("roleId", "name")
        .skip(pagination.skipPage)
        .limit(pagination.limitPage);
    const adminRoleList = yield adminRole_model_1.default.find({
        deleted: false,
        status: "active",
    }).select("name");
    res.render("admin/pages/admin/admin.view.ejs", {
        pageTitle: "Danh sách quản trị viên",
        pathname,
        adminList,
        pagination,
        keyword,
        status,
        statusFilter,
        sort: sortFilter.sort,
        adminRoleList,
        role,
    });
});
// [GET]: /admin/admins/create
const createANewAdminGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        const adminRoleList = yield adminRole_model_1.default.find(find).select("name");
        res.render("admin/pages/admin/create.view.ejs", {
            pageTitle: "Tạo mới quản trị viên",
            pathname,
            adminRoleList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin",
        });
        return;
    }
});
// [POST]: /admin/admins/create
const createANewAdminPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield admin_model_1.default.countDocuments();
        let avatar = "";
        let password = "";
        let fullName = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        if (req.body.password)
            password = yield (0, hashPassword_helper_1.default)(req.body.password);
        if (req.body.name)
            fullName = req.body.name;
        const existingAdmin = yield admin_model_1.default.findOne({
            email: req.body.email,
        });
        if (existingAdmin) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Email người dùng đã được đăng ký! ",
            });
            return;
        }
        const dataBodyCreateAdmin = {
            email: req.body.email ? req.body.email : "",
            password: password ? password : "",
            phone: req.body.phone ? req.body.phone : "",
            avatar: avatar ? avatar : "",
            fullName: fullName ? fullName : "",
            birthday: req.body.birthday ? req.body.birthday : null,
            address: req.body.address ? req.body.address : null,
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : "active",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
            roleId: req.body.roleId ? req.body.roleId : "",
        };
        const newAdmin = new admin_model_1.default(dataBodyCreateAdmin);
        yield newAdmin.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới quản trị viên thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin",
        });
        return;
    }
});
// [GET]: /admin/admins/update/:adminId
const getAAdminByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let adminId = "";
        if (req.params.adminId)
            adminId = req.params.adminId;
        const admin = yield admin_model_1.default.findOne({
            _id: adminId,
            deleted: false,
        }).select("-deleted -deletedAt");
        const adminRoleList = yield adminRole_model_1.default.find({
            deleted: false,
            status: "active",
        }).select("name");
        if (!admin) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy quản trị viên!",
            });
            return;
        }
        res.render("admin/pages/admin/update.view.ejs", {
            pageTitle: "Cập nhật quản trị viên",
            pathname,
            admin,
            adminRoleList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update admin",
        });
        return;
    }
});
// [PATCH]: /admin/admins/update/:adminId
const updateAAdminByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let adminId = "";
        let avatar = "";
        let password = "";
        if (req.params.adminId)
            adminId = req.params.adminId;
        const admin = yield admin_model_1.default.findOne({
            _id: adminId,
            deleted: false,
        });
        if (!admin) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy quản trị viên!",
            });
            return;
        }
        if (req.body.avatar)
            avatar = req.body.avatar;
        if (req.body.password)
            password = yield (0, hashPassword_helper_1.default)(req.body.password);
        const dataBodyUpdateAdmin = {
            email: req.body.email ? req.body.email : admin.email,
            password: password ? password : admin.password,
            phone: req.body.phone ? req.body.phone : admin.phone,
            avatar: avatar ? avatar : admin.avatar,
            fullName: req.body.fullName ? req.body.fullName : admin.fullName,
            birthday: req.body.birthday ? req.body.birthday : admin.birthday,
            address: req.body.address ? req.body.address : admin.address,
            description: req.body.description
                ? req.body.description
                : admin.description,
            status: req.body.status ? req.body.status : admin.status,
            position: req.body.position ? req.body.position : admin.position,
            roleId: req.body.roleId ? req.body.roleId : admin.roleId,
        };
        yield admin_model_1.default.updateOne({ _id: adminId }, dataBodyUpdateAdmin);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật quản trị viên thành công",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update admin",
        });
        return;
    }
});
// [PATCH]: /admin/admins/soft-delete/:adminId
const softRemoveAdminByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let adminId = "";
        if (req.params.adminId)
            adminId = req.params.adminId;
        const admin = yield admin_model_1.default.findOne({
            _id: adminId,
            deleted: false,
        });
        if (!admin) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy quản trị viên!",
            });
            return;
        }
        yield admin_model_1.default.updateOne({ _id: adminId }, { deleted: true });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Xóa quản trị viên thành công",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - soft remove admin",
        });
        return;
    }
});
// [PATCH]: /admin/admins/change-status/:adminId/:status
const changeStatusAdminPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let adminId = "";
        let status = "";
        if (req.params.adminId)
            adminId = req.params.adminId;
        if (req.params.status)
            status = req.params.status;
        const admin = yield admin_model_1.default.findOne({
            _id: adminId,
            deleted: false,
        });
        if (!admin) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy quản trị viên!",
            });
            return;
        }
        yield admin_model_1.default.updateOne({ _id: adminId }, { status: status });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật trạng thái quản trị viên thành công",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - change status admin",
        });
        return;
    }
});
// [PATCH]: /admin/admins/update-multi
const updateMultiAdminPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                yield admin_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "active" });
                break;
            case "status-inactive":
                yield admin_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: "inactive" });
                break;
            case "soft-deleted":
                yield admin_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { deleted: true });
                break;
            case "hard-deleted":
                yield admin_model_1.default.deleteMany({ _id: { $in: ids } });
                break;
            default:
                break;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật quản trị viên thành công",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update multi admin",
        });
        return;
    }
});
exports.adminController = {
    adminGet,
    createANewAdminGet,
    createANewAdminPost,
    getAAdminByIdGet,
    updateAAdminByIdPatch,
    softRemoveAdminByIdPatch,
    changeStatusAdminPatch,
    updateMultiAdminPatch,
};
exports.default = exports.adminController;
