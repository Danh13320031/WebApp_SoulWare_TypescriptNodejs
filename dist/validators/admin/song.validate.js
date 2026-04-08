"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const createANewSongValidate = (req, res, next) => {
    const files = req.files;
    if (!files.avatar || files.avatar.length <= 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Ảnh đại diện không được để trống",
        });
        return;
    }
    if (!files.audio || files.audio.length <= 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Tệp âm thanh không được để trống",
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
    if ((!req.body.singers || req.body.singers.length <= 0) &&
        (!req.body.singerGroups || req.body.singerGroups.length <= 0)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn ca sĩ hoặc nhóm ca sĩ",
        });
        return;
    }
    if (!req.body.topicId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn chủ đề",
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
const updateASongByIdValidate = (req, res, next) => {
    if (!req.params.songId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Không tìm thấy bài hát",
        });
        return;
    }
    const files = req.files;
    const hasNewAvatar = files.avatar && files.avatar.length > 0;
    const hasOldAvatar = req.body.oldAvatar && req.body.oldAvatar.trim() !== "";
    if (!hasNewAvatar && !hasOldAvatar) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Ảnh đại diện không được để trống",
        });
        return;
    }
    const hasNewAudio = files.audio && files.audio.length > 0;
    const hasOldAudio = req.body.oldAudio && req.body.oldAudio.trim() !== "";
    if (!hasNewAudio && !hasOldAudio) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Tệp âm thanh không được để trống",
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
    if ((!req.body.singers || req.body.singers.length <= 0) &&
        (!req.body.singerGroups || req.body.singerGroups.length <= 0)) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn ca sĩ hoặc nhóm ca sĩ",
        });
        return;
    }
    if (!req.body.topicId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            code: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: "Fail",
            message: "Vui lòng chọn chủ đề",
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
const songValidate = {
    createANewSongValidate,
    updateASongByIdValidate,
};
exports.default = songValidate;
