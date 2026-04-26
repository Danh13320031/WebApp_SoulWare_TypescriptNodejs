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
const hashPassword_helper_1 = __importDefault(require("../../helpers/hashPassword.helper"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const showProfileGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.userAccount ? res.locals.userAccount : null;
        if (!user) {
            res.redirect("/auth/login");
            return;
        }
        res.render("client/pages/user/profile.view.ejs", {
            pageTitle: "Thông tin cá nhân",
            keyword: "",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - show profile",
        });
        return;
    }
});
const updateProfilePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = req.body.password
            ? yield (0, hashPassword_helper_1.default)(req.body.password)
            : null;
        const user = yield user_model_1.default.findOne({ _id: res.locals.userAccount._id });
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                code: http_status_codes_1.StatusCodes.NOT_FOUND,
                status: "Fail",
                message: "Không tìm thấy người dùng! ",
            });
            return;
        }
        const dataBodyUpdateProfile = {
            fullName: req.body.fullName ? req.body.fullName : user.fullName,
            email: req.body.email ? req.body.email : user.email,
            password: hashedPassword ? hashedPassword : user.password,
            phone: req.body.phone ? req.body.phone : user.phone,
            avatar: req.body.avatar ? req.body.avatar : user.avatar,
            birthday: req.body.birthday ? req.body.birthday : user.birthday,
            address: req.body.address ? req.body.address : user.address,
            description: req.body.description
                ? req.body.description
                : user.description,
        };
        yield user_model_1.default.updateOne({ _id: res.locals.userAccount._id }, dataBodyUpdateProfile);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            status: "Success",
            message: "Cập nhật thống tin người dùng thành công!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - update profile",
        });
        return;
    }
});
const userController = {
    showProfileGet,
    updateProfilePatch,
};
exports.default = userController;
