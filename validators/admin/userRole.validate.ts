import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const createANewUserRoleValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.name) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      status: "Fail",
      message: "Vui lòng nhập tên vai trò",
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

const userRoleValidate = {
  createANewUserRoleValidate,
};

export default userRoleValidate;
