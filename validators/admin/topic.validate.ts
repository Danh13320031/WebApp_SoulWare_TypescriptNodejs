import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createANewTopicValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const file = req.file as Express.Multer.File;

  if (!file || file.fieldname !== "avatar") {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Ảnh đại diện không được để trống",
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

const updateATopicByIdValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.params.topicId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Không tìm thấy bài hát",
    });
    return;
  }

  const file = req.file as Express.Multer.File;

  const hasNewAvatar = file && file.fieldname === "avatar";
  const hasOldAvatar = req.body.oldAvatar && req.body.oldAvatar.trim() !== "";

  if (!hasNewAvatar && !hasOldAvatar) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Ảnh đại diện không được để trống",
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

const topicValidate = {
  createANewTopicValidate,
  updateATopicByIdValidate,
};

export default topicValidate;
