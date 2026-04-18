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
const generateAccessToken_helper_1 = __importDefault(require("../../helpers/generateAccessToken.helper"));
const generateRefreshToken_helper_1 = __importDefault(require("../../helpers/generateRefreshToken.helper"));
const hashPassword_helper_1 = __importDefault(require("../../helpers/hashPassword.helper"));
const subscriptionPlan_model_1 = __importDefault(require("../../models/subscriptionPlan.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const registerGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("client/pages/auth/register.view.ejs", {
            pageTitle: "Đăng ký",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - register",
        });
        return;
    }
});
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let password = "";
    if (req.body.password)
        password = req.body.password;
    try {
        const existingUser = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (existingUser) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Email người dùng đã được đăng ký! ",
            });
            return;
        }
        const subscriptionPlan = yield subscriptionPlan_model_1.default.findOne({
            code: "FREE",
            deleted: false,
        });
        if (!subscriptionPlan) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Không tìm thấy gói người dùng! ",
            });
            return;
        }
        const dataRegister = {
            email: req.body.email ? req.body.email : null,
            phone: req.body.phone ? req.body.phone : null,
            password: yield (0, hashPassword_helper_1.default)(password),
            confirmPassword: req.body.confirmPassword
                ? req.body.confirmPassword
                : null,
            fullName: req.body.fullName ? req.body.fullName : null,
            subscriptionPlanId: subscriptionPlan._id.toString(),
        };
        console.log(dataRegister);
        const newUser = new user_model_1.default(dataRegister);
        yield newUser.save();
        const accessTokenPayload = {
            id: newUser._id.toString(),
            email: newUser.email,
            subscriptionPlanId: newUser.subscriptionPlanId
                ? newUser.subscriptionPlanId.toString()
                : "",
        };
        const accessToken = (0, generateAccessToken_helper_1.default)(accessTokenPayload, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_CLIENT, auth_constant_1.AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT);
        const refreshToken = (0, generateRefreshToken_helper_1.default)({ id: newUser._id.toString() }, auth_constant_1.AUTH_REFRESH_TOKEN_SECRET_CLIENT, auth_constant_1.AUTH_REFRESH_TOKEN_EXPIRES_IN_CLIENT);
        res.cookie("accessTokenUser", accessToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT }));
        res.cookie("refreshTokenUser", refreshToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_CLIENT }));
        newUser.refreshToken = refreshToken;
        yield newUser.save();
        res.json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Register successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - register",
        });
        return;
    }
});
const authController = {
    registerGet,
    registerPost,
};
exports.default = authController;
