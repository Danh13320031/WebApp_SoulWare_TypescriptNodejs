import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EMAIL_REGEX,
  STRONG_PASSWORD_REGEX,
} from "../../constants/regex.constant";

const loginValidate = (req: Request, res: Response, next: NextFunction) => {
  const emailRegex = EMAIL_REGEX;

  if (!req.body.email) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập địa chỉ email",
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

const authValidate = { loginValidate };

export default authValidate;
