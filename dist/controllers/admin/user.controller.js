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
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const hashPassword_helper_1 = __importDefault(require("../../helpers/hashPassword.helper"));
// import UserRoleModel from "../../models/userRole.model";
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const handleStatusFilter_helper_1 = __importDefault(require("../../helpers/admin/handleStatusFilter.helper"));
const handleSortFilter_helper_1 = __importDefault(require("../../helpers/admin/handleSortFilter.helper"));
const app_constant_1 = require("../../constants/app.constant");
const handlePagination_helper_1 = __importDefault(require("../../helpers/handlePagination.helper"));
// [GET]: /admin/users
const getAllUserGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Handle singer filter
        let role = "all";
        if (req.query.role)
            role = req.query.role;
        if (role && role !== "all")
            find = Object.assign(Object.assign({}, find), { roleId: {
                    _id: role,
                } });
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
        const count = yield user_model_1.default.countDocuments(find);
        const pagination = yield (0, handlePagination_helper_1.default)(page, limit, type, count);
        const userList = yield user_model_1.default.find(find)
            .select("fullName email phone avatar status position roleId")
            .populate("roleId", "name")
            .sort(sortFilter.sortOptions);
        // const userRoleList = await UserRoleModel.find({
        //   deleted: false,
        //   status: "active",
        // }).select("name");
        res.render("admin/pages/user/user.view.ejs", {
            pageTitle: "Quản lý người dùng",
            pathname,
            userList,
            keyword,
            status,
            statusFilter,
            sort: sortFilter.sort,
            // userRoleList,
            role,
            pagination,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Error",
            message: "Lỗi khi lấy danh sách người dùng",
        });
        return;
    }
});
// [GET]: /admin/users/create
const createANewUserGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        // const userRoleList = await UserRoleModel.find(find).select("name");
        res.render("admin/pages/user/create.view.ejs", {
            pageTitle: "Tạo mới người dùng",
            pathname,
            // userRoleList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new user",
        });
        return;
    }
});
// [POST]: /admin/users/create
const createANewUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield user_model_1.default.countDocuments();
        let avatar = "";
        let password = "";
        let fullName = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        if (req.body.password)
            password = yield (0, hashPassword_helper_1.default)(req.body.password);
        if (req.body.name)
            fullName = req.body.name;
        const existingUser = yield user_model_1.default.findOne({
            email: req.body.email,
        });
        if (existingUser) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Email người dùng đã được đăng ký!",
            });
            return;
        }
        const dataBodyCreateUser = {
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
            // roleId: req.body.roleId
            //   ? req.body.roleId === "user"
            //     ? null
            //     : req.body.roleId
            //   : null,
        };
        const newUser = new user_model_1.default(dataBodyCreateUser);
        yield newUser.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới người dùng thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new user",
        });
        return;
    }
});
// [GET]: /admin/users/update/:userId
const getAUserByIdGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let userId = "";
        if (req.params.userId)
            userId = req.params.userId;
        const user = yield user_model_1.default.findOne({
            _id: userId,
            deleted: false,
        }).select("-deleted -deletedAt");
        // const userRoleList = await UserRoleModel.find({
        //   deleted: false,
        //   status: "active",
        // }).select("name");
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy người dùng!",
            });
            return;
        }
        res.render("admin/pages/user/update.view.ejs", {
            pageTitle: "Cập nhật người dùng",
            pathname,
            user,
            // userRoleList,
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
// [PATCH]: /admin/users/update/:adminId
const updateAUserByIdPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = "";
        let avatar = "";
        let password = "";
        if (req.params.userId)
            userId = req.params.userId;
        const admin = yield user_model_1.default.findOne({
            _id: userId,
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
        const dataBodyUpdateUser = {
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
            // roleId: req.body.roleId
            //   ? req.body.roleId === "user"
            //     ? null
            //     : req.body.roleId
            //   : admin.roleId,
        };
        yield user_model_1.default.updateOne({ _id: userId }, dataBodyUpdateUser);
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
const userController = {
    getAllUserGet,
    createANewUserGet,
    createANewUserPost,
    getAUserByIdGet,
    updateAUserByIdPatch,
};
exports.default = userController;
