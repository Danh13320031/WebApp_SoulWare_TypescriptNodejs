import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EMAIL_REGEX,
  STRONG_PASSWORD_REGEX,
  VN_PHONE_REGEX,
} from "../../constants/regex.constant";

const registerValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
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

  if (!req.body.confirmPassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "VUi lòng xác nhận mật khâu",
    });
    return;
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Xác nhận mật khâu không chính xác",
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

const loginValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const emailRegex = EMAIL_REGEX;

  if (!req.body.email) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập địa chỉ email",
    });
    return;
  }
  if (!emailRegex.test(req.body.email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Địa chỉ email không hợp lệ",
    });
    return;
  }

  const strongPasswordRegex = STRONG_PASSWORD_REGEX;

  if (!req.body.password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập mật khẩu",
    });
    return;
  }
  if (!strongPasswordRegex.test(req.body.password)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Mật khẩu không hợp lệ",
    });
    return;
  }

  next();
};

const authValidate = { registerValidate, loginValidate };

export default authValidate;
