import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EMAIL_REGEX,
  STRONG_PASSWORD_REGEX,
  VN_PHONE_REGEX,
} from "../../constants/regex.constant";

const updateProfileValidate = (
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

  if (!req.body.password) {
    delete req.body.password;
    delete req.body.confirmPassword;
  } else {
    const strongPasswordRegex = STRONG_PASSWORD_REGEX;

    if (!strongPasswordRegex.test(req.body.password)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Mật khẩu không hợp lệ",
      });
      return;
    }

    if (
      !req.body.confirmPassword ||
      req.body.confirmPassword !== req.body.password
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Xác nhận mật khẩu không hợp lệ",
      });
      return;
    }
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

  if (!req.body.fullName) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Họ và tên không được để trống",
    });
    return;
  }

  next();
};

const userValidate = {
  updateProfileValidate,
};

export default userValidate;
