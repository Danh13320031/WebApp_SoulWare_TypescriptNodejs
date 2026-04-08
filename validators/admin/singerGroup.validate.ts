import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createANewSingerGroupValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const file = req.file as Express.Multer.File;

  if (!file || file.fieldname !== "avatar") {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn ảnh đại diện",
    });
    return;
  }

  if (!req.body.name) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Tên nhóm không được để trống",
    });
    return;
  }

  if (!req.body.singers) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn thành viên cho nhóm",
    });
    return;
  }
  if (req.body.singers.length < 2) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Nhóm cần có ít nhất 2 thành viên",
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

const updateASingerGroupByIdValidate = (
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
      message: "Vui lòng nhập tên nhóm ca sĩ",
    });
    return;
  }

  if (!req.body.singers) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng chọn thành viên cho nhóm",
    });
    return;
  }
  if (req.body.singers.length < 2) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Nhóm cần có ít nhất 2 thành viên",
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

const singerGroupValidate = {
  createANewSingerGroupValidate,
  updateASingerGroupByIdValidate,
};

export default singerGroupValidate;
