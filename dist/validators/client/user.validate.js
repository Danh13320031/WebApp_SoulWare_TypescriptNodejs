"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const regex_constant_1 = require("../../constants/regex.constant");
const updateProfileValidate = (req, res, next) => {
    const file = req.file;
    const hasNewAvatar = file && file.fieldname === "avatar";
    const hasOldAvatar = req.body.oldAvatar && req.body.oldAvatar.trim() !== "";
    if (!hasNewAvatar && !hasOldAvatar) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Ảnh đại diện không được để trống",
        });
        return;
    }
    const emailRegex = regex_constant_1.EMAIL_REGEX;
    if (!req.body.email) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Địa chỉ email không được để trống",
        });
        return;
    }
    if (!emailRegex.test(req.body.email)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Địa chỉ email không hợp lệ",
        });
        return;
    }
    if (!req.body.password) {
        delete req.body.password;
        delete req.body.confirmPassword;
    }
    else {
        const strongPasswordRegex = regex_constant_1.STRONG_PASSWORD_REGEX;
        if (!strongPasswordRegex.test(req.body.password)) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Mật khẩu không hợp lệ",
            });
            return;
        }
        if (!req.body.confirmPassword ||
            req.body.confirmPassword !== req.body.password) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Xác nhận mật khẩu không hợp lệ",
            });
            return;
        }
    }
    const vnPhoneRegex = regex_constant_1.VN_PHONE_REGEX;
    if (!req.body.phone) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Số điện thoại không được để trống",
        });
        return;
    }
    if (!vnPhoneRegex.test(req.body.phone)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Số điện thoại không hợp lệ",
        });
        return;
    }
    if (!req.body.fullName) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Họ và tên không được để trống",
        });
        return;
    }
    next();
};
const userValidate = {
    updateProfileValidate,
};
exports.default = userValidate;
