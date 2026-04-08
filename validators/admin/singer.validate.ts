import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createANewSingerValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const file = req.file as Express.Multer.File;

  if (!file || file.fieldname !== "avatar") {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Ảnh đại diện không được để trống",
    });
    return;
  }

  if (!req.body.name) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập tên ca si",
    });
    return;
  }

  if (!req.body.stageName) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập nghệ danh ca sĩ",
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

const updateASingerByIdValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

  if (!req.body.name) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Họ và tên không được để trống",
    });
    return;
  }

  if (!req.body.stageName) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Nghệ danh không được để trống",
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

const singerValidate = { createANewSingerValidate, updateASingerByIdValidate };

export default singerValidate;
