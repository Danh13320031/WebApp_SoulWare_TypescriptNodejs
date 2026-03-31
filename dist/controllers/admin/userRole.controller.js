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
const userRole_model_1 = __importDefault(require("../../models/userRole.model"));
// [GET]: /admin/user-roles
const getAllUserRoleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        res.render("admin/pages/userRole/userRole.view.ejs", {
            pageTitle: "Danh sách vai trò người dùng",
            pathname,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi khi lấy danh sách vai trò người dùng",
        });
        return;
    }
});
// [GET]: /admin/user-roles/create4
const createANewUserRoleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        res.render("admin/pages/userRole/create.view.ejs", {
            pageTitle: "Tạo mới vai trò người dùng",
            pathname,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Lỗi khi tạo mới vai trò người dùng",
        });
        return;
    }
});
// [POST]: /admin/user-roles/create
const createANewUserRolePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield userRole_model_1.default.countDocuments();
        const dataBodyCreateUserRole = {
            name: req.body.name || "",
            status: req.body.status || "active",
            description: req.body.description || "",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
        };
        const newUserRole = new userRole_model_1.default(dataBodyCreateUserRole);
        yield newUserRole.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới vai trò người dùng thành công!",
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
const UserRoleController = {
    getAllUserRoleGet,
    createANewUserRoleGet,
    createANewUserRolePost,
};
exports.default = UserRoleController;
