"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const createANewTopicValidate = (req, res, next) => {
    if (!req.body.avatar) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Ảnh đại diện không được để trống",
        });
        return;
    }
    if (!req.body.title) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập tên bài hát",
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
const topicValidate = {
    createANewTopicValidate,
};
exports.default = topicValidate;
