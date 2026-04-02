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
const userRole_model_1 = __importDefault(require("../../models/userRole.model"));
// [GET]: /admin/users
const getAllUserGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        const userList = yield user_model_1.default.find(find)
            .select("fullName email phone avatar status position roleId")
            .populate("roleId", "name")
            .sort({ position: "desc" });
        res.render("admin/pages/user/user.view.ejs", {
            pageTitle: "Quản lý người dùng",
            pathname,
            userList,
        });
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
        const userRoleList = yield userRole_model_1.default.find(find).select("name");
        res.render("admin/pages/user/create.view.ejs", {
            pageTitle: "Tạo mới người dùng",
            pathname,
            userRoleList,
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
            roleId: req.body.roleId ? req.body.roleId : null,
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
const userController = {
    getAllUserGet,
    createANewUserGet,
    createANewUserPost,
};
exports.default = userController;
