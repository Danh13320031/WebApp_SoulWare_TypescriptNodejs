"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const regex_constant_1 = require("../../constants/regex.constant");
const createANewAdminValidate = (req, res, next) => {
    if (!req.body.avatar) {
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
    const strongPasswordRegex = regex_constant_1.STRONG_PASSWORD_REGEX;
    if (!req.body.password) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Mật khâu không được để trống",
        });
        return;
    }
    if (!strongPasswordRegex.test(req.body.password)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Mật khẩu không hợp lệ",
        });
        return;
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
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Họ và tên không được để trống",
        });
        return;
    }
    if (!req.body.status) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn trạng thái",
        });
        return;
    }
    next();
};
const updateAAdminByIdValidate = (req, res, next) => {
    if (!req.params.adminId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Không tìm thấy quản trị viên",
        });
        return;
    }
    const hasNewAvatar = req.body.avatar && req.body.avatar.length > 0;
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
    const strongPasswordRegex = regex_constant_1.STRONG_PASSWORD_REGEX;
    if (req.body.password) {
        if (!strongPasswordRegex.test(req.body.password)) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: "Fail",
                message: "Mật khâu không hợp lệ",
            });
            return;
        }
    }
    else {
        delete req.body.password;
    }
    const vnPhoneRegex = regex_constant_1.VN_PHONE_REGEX;
    if (!req.body.phone) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Số điện thoại không được sé trống",
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
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Họ và tên không được để trống",
        });
        return;
    }
    if (!req.body.status) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn trạng thái",
        });
        return;
    }
    next();
};
const adminValidate = {
    createANewAdminValidate,
    updateAAdminByIdValidate,
};
exports.default = adminValidate;
