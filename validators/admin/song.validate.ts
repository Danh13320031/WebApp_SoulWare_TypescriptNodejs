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

const songValidate = {
  createANewSongValidate,
};

export default songValidate;
