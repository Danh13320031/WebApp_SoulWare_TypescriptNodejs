"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const createANewSingerGroupValidate = (req, res, next) => {
    const file = req.file;
    if (!file || file.fieldname !== "avatar") {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn ảnh đại diện",
        });
        return;
    }
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Tên nhóm không được để trống",
        });
        return;
    }
    if (!req.body.singers) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn thành viên cho nhóm",
        });
        return;
    }
    if (req.body.singers.length < 2) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Nhóm cần có ít nhất 2 thành viên",
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
const updateASingerGroupByIdValidate = (req, res, next) => {
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
    if (!req.body.name) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng nhập tên nhóm ca sĩ",
        });
        return;
    }
    if (!req.body.singers) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn thành viên cho nhóm",
        });
        return;
    }
    if (req.body.singers.length < 2) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Nhóm cần có ít nhất 2 thành viên",
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
const singerGroupValidate = {
    createANewSingerGroupValidate,
    updateASingerGroupByIdValidate,
};
exports.default = singerGroupValidate;
