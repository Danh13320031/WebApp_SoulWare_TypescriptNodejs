"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const regex_constant_1 = require("../../constants/regex.constant");
const loginValidate = (req, res, next) => {
    const emailRegex = regex_constant_1.EMAIL_REGEX;
    if (!req.body.email) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập địa chỉ email",
        });
        return;
    }
    if (!emailRegex.test(req.body.email)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Địa chỉ email không hợp lệ",
        });
        return;
    }
    const strongPasswordRegex = regex_constant_1.STRONG_PASSWORD_REGEX;
    if (!req.body.password) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập mật khẩu",
        });
        return;
    }
    if (!strongPasswordRegex.test(req.body.password)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Mật khẩu không hợp lệ",
        });
        return;
    }
    next();
};
const authValidate = { loginValidate };
exports.default = authValidate;
