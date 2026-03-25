import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN,
  AUTH_ACCESS_TOKEN_SECRET_ADMIN,
  AUTH_COOKIE_OPTIONS,
  AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_ADMIN,
  AUTH_REFRESH_TOKEN_EXPIRES_IN_ADMIN,
  AUTH_REFRESH_TOKEN_SECRET_ADMIN,
} from "../../constants/auth.constant";
import comparePassword from "../../helpers/comparePassword.helper";
import generateAccessToken from "../../helpers/generateAccessToken.helper";
import generateRefreshToken from "../../helpers/generateRefreshToken.helper";
import AdminModel from "../../models/admin.model";
import {
  TDataAccessTokenPayload,
  TDataRefreshTokenPayload,
} from "../../types/auth.type";
import activeSider from "../../helpers/admin/activeSider.helper";
import AdminRoleModel from "../../models/adminRole.model";

// [GET]: /admin/auth/login
const loginGet = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render("admin/pages/auth/login.view.ejs", {
      pageTitle: "Đăng nhập",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - login",
    });
    return;
  }
};

// [POST]: /admin/auth/login
const loginPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email ? req.body.email : "";
    const password: string = req.body.password ? req.body.password : "";

    const admin = await AdminModel.findOne({
      email: email,
      deleted: false,
    });

    if (!admin) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email không tồn tại trong hệ thống",
      });
      return;
    }

    const passwordMatch = await comparePassword(password, admin.password);

    if (!passwordMatch) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email hoặc mật khẩu không chính xác",
      });
      return;
    }

    const dataAccessTokenPayload: TDataAccessTokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      roleId: admin.roleId.toString(),
    };

    const dataRefreshTokenPayload: TDataRefreshTokenPayload = {
      id: admin._id.toString(),
    };

    const accessToken = generateAccessToken(
      dataAccessTokenPayload,
      AUTH_ACCESS_TOKEN_SECRET_ADMIN,
      AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN,
    );
    const refreshToken = generateRefreshToken(
      dataRefreshTokenPayload,
      AUTH_REFRESH_TOKEN_SECRET_ADMIN,
      AUTH_REFRESH_TOKEN_EXPIRES_IN_ADMIN,
    );

    admin.refreshToken = refreshToken;
    await admin.save();

    res.cookie("accessTokenAdmin", accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN,
    });
    res.cookie("refreshTokenAdmin", refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_ADMIN,
    });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Đăng nhập thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - login",
    });
    return;
  }
};

// [GET]: /admin/auth/logout
const logoutGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = res.locals.adminAccount ? res.locals.adminAccount : null;

    if (admin)
      await AdminModel.updateOne({ _id: admin._id }, { refreshToken: "" });

    res.clearCookie("accessTokenAdmin");
    res.clearCookie("refreshTokenAdmin");

    res.redirect("/admin/auth/login");
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - logout",
    });
    return;
  }
};

// [GET]: /admin/auth/admin-permissions
const getAllAdminPermissionGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find = { deleted: false, status: "active" };

    const adminRoleList =
      await AdminRoleModel.find(find).select("name permissions");

    res.render("admin/pages/auth/adminPermission.view.ejs", {
      pageTitle: "Phân quyền quản trị",
      pathname,
      adminRoleList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getAllAdminPermission",
    });
    return;
  }
};

// [PATCH]: /admin/auth/admin-permissions/update
const updateAdminPermissionPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const permissionList = req.body;

    for (const permission of permissionList) {
      await AdminRoleModel.updateOne(
        { _id: permission.roleId },
        { permissions: permission.permissions },
      );
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Câp nhật thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - updateAdminPermission",
    });
    return;
  }
};

type TAuthController = {
  loginGet: (req: Request, res: Response) => Promise<void>;
  loginPost: (req: Request, res: Response) => Promise<void>;
  logoutGet: (req: Request, res: Response) => Promise<void>;
  getAllAdminPermissionGet: (req: Request, res: Response) => Promise<void>;
  updateAdminPermissionPatch: (req: Request, res: Response) => Promise<void>;
};

const authController: TAuthController = {
  loginGet,
  loginPost,
  logoutGet,
  getAllAdminPermissionGet,
  updateAdminPermissionPatch,
};

export default authController;
