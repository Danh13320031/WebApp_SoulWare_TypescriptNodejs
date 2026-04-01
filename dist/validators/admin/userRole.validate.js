"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const createANewUserRoleValidate = (req, res, next) => {
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập tên vai trò",
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
const updateUserRoleValidate = (req, res, next) => {
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập tên vai trò",
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
const userRoleValidate = {
    createANewUserRoleValidate,
    updateUserRoleValidate,
};
exports.default = userRoleValidate;
