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
const auth_constant_1 = require("../../constants/auth.constant");
const comparePassword_helper_1 = __importDefault(require("../../helpers/comparePassword.helper"));
const generateAccessToken_helper_1 = __importDefault(require("../../helpers/generateAccessToken.helper"));
const generateRefreshToken_helper_1 = __importDefault(require("../../helpers/generateRefreshToken.helper"));
const admin_model_1 = __importDefault(require("../../models/admin.model"));
// [GET]: /admin/auth/login
const loginGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/pages/auth/login.view.ejs", {
            pageTitle: "Đăng nhập",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - login",
        });
        return;
    }
});
// [POST]: /admin/auth/login
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email ? req.body.email : "";
        const password = req.body.password ? req.body.password : "";
        const admin = yield admin_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (!admin) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Email không tồn tại trong hệ thống",
            });
            return;
        }
        const passwordMatch = yield (0, comparePassword_helper_1.default)(password, admin.password);
        if (!passwordMatch) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Email hoặc mật khẩu không chính xác",
            });
            return;
        }
        const dataAccessTokenPayload = {
            id: admin._id.toString(),
            email: admin.email,
            roleId: admin.roleId.toString(),
        };
        const dataRefreshTokenPayload = {
            id: admin._id.toString(),
        };
        const accessToken = (0, generateAccessToken_helper_1.default)(dataAccessTokenPayload, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_ADMIN, auth_constant_1.AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN);
        const refreshToken = (0, generateRefreshToken_helper_1.default)(dataRefreshTokenPayload, auth_constant_1.AUTH_REFRESH_TOKEN_SECRET_ADMIN, auth_constant_1.AUTH_REFRESH_TOKEN_EXPIRES_IN_ADMIN);
        admin.refreshToken = refreshToken;
        yield admin.save();
        res.cookie("accessTokenAdmin", accessToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN }));
        res.cookie("refreshTokenAdmin", refreshToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_ADMIN }));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Đăng nhập thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - login",
        });
        return;
    }
});
// [GET]: /admin/auth/logout
const logoutGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = res.locals.adminAccount ? res.locals.adminAccount : null;
        if (admin)
            yield admin_model_1.default.updateOne({ _id: admin._id }, { refreshToken: "" });
        res.clearCookie("accessTokenAdmin");
        res.clearCookie("refreshTokenAdmin");
        res.redirect("/admin/auth/login");
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - logout",
        });
        return;
    }
});
const authController = { loginGet, loginPost, logoutGet };
exports.default = authController;
