import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createANewSongValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.avatar) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Ảnh đại diện không được để trống",
    });
    return;
  }

  if (!req.body.audio) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Tệp âm thanh không được để trống",
    });
    return;
  }

  if (!req.body.title) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập tên bài hát",
    });
    return;
  }

  if (!req.body.singerId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn ca sĩ",
    });
    return;
  }

  if (!req.body.topicId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn chủ đề",
    });
    return;
  }

  if (!req.body.status) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn trạng thái",
    });
    return;
  }

  next();
};

const updateASongByIdValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.params.songId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Không tìm thấy bài hát",
    });
    return;
  }

  const hasNewAvatar = req.body.avatar && req.body.avatar.length > 0;
  const hasOldAvatar = req.body.oldAvatar && req.body.oldAvatar.trim() !== "";

  if (!hasNewAvatar && !hasOldAvatar) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Ảnh đại diện không được để trống",
    });
    return;
  }

  const hasNewAudio = req.body.audio && req.body.audio.length > 0;
  const hasOldAudio = req.body.oldAudio && req.body.oldAudio.trim() !== "";

  if (!hasNewAudio && !hasOldAudio) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Tệp âm thanh không được để trống",
    });
    return;
  }

  if (!req.body.title) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập tên bài hát",
    });
    return;
  }

  if (!req.body.singerId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn ca sĩ",
    });
    return;
  }

  if (!req.body.topicId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn chủ đề",
    });
    return;
  }

  if (!req.body.status) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
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

export default songValidate;
