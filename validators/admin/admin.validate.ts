import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EMAIL_REGEX,
  STRONG_PASSWORD_REGEX,
  VN_PHONE_REGEX,
} from "../../constants/regex.constant";

const createANewAdminValidate = (
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

  const emailRegex = EMAIL_REGEX;

  if (!req.body.email) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Địa chỉ email không được để trống",
    });
    return;
  }
  if (!emailRegex.test(req.body.email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Địa chỉ email không hợp lệ",
    });
    return;
  }

  const strongPasswordRegex = STRONG_PASSWORD_REGEX;

  if (!req.body.password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Mật khâu không được để trống",
    });
    return;
  }
  if (!strongPasswordRegex.test(req.body.password)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Mật khẩu không hợp lệ",
    });
    return;
  }

  const vnPhoneRegex = VN_PHONE_REGEX;

  if (!req.body.phone) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Số điện thoại không được để trống",
    });
    return;
  }
  if (!vnPhoneRegex.test(req.body.phone)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Số điện thoại không hợp lệ",
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

const updateAAdminByIdValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.params.adminId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Không tìm thấy quản trị viên",
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

  const emailRegex = EMAIL_REGEX;

  if (!req.body.email) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Địa chỉ email không được để trống",
    });
    return;
  }
  if (!emailRegex.test(req.body.email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Địa chỉ email không hợp lệ",
    });
    return;
  }

  const strongPasswordRegex = STRONG_PASSWORD_REGEX;

  if (req.body.password) {
    if (!strongPasswordRegex.test(req.body.password)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Mật khâu không hợp lệ",
      });
      return;
    }
  } else {
    delete req.body.password;
  }

  const vnPhoneRegex = VN_PHONE_REGEX;

  if (!req.body.phone) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Số điện thoại không được sé trống",
    });
    return;
  }
  if (!vnPhoneRegex.test(req.body.phone)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Số điện thoại không hợp lệ",
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

const adminValidate = {
  createANewAdminValidate,
  updateAAdminByIdValidate,
};

export default adminValidate;
