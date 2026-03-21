import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN,
  AUTH_ACCESS_TOKEN_SECRET_ADMIN,
  AUTH_COOKIE_OPTIONS,
  AUTH_REFRESH_TOKEN_SECRET_ADMIN,
} from "../../constants/auth.constant";
import generateAccessToken from "../../helpers/generateAccessToken.helper";
import verifyToken from "../../helpers/verifyToken.helper";
import AdminModel from "../../models/admin.model";
import { TDataAccessTokenPayload } from "../../types/auth.type";

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const accessToken = req.cookies["accessTokenAdmin"];
  const refreshToken = req.cookies["refreshTokenAdmin"];

  if (!accessToken && !refreshToken) return res.redirect("/admin/auth/login");

  try {
    if (accessToken) {
      const decoded = verifyToken(
        accessToken,
        AUTH_ACCESS_TOKEN_SECRET_ADMIN,
      ) as JwtPayload;

      const admin = await AdminModel.findOne({
        _id: decoded.id,
        deleted: false,
      })
        .select(
          "-deleted -deletedAt -createdAt -updatedAt -slug -refreshToken -__v",
        )
        .populate("roleId", "permissions");

      if (!admin) throw new Error("Admin not found");

      res.locals.adminAccount = admin;
      return next();
    }
  } catch (err: any) {
    if (err.name !== "TokenExpiredError") {
      res.clearCookie("accessTokenAdmin");
      res.clearCookie("refreshTokenAdmin");
      return res.redirect("/admin/auth/login");
    }
  }

  if (!refreshToken) return res.redirect("/admin/auth/login");

  try {
    const decodedRefresh = verifyToken(
      refreshToken,
      AUTH_REFRESH_TOKEN_SECRET_ADMIN,
    ) as JwtPayload;

    const admin = await AdminModel.findOne({
      _id: decodedRefresh.id,
      refreshToken: refreshToken,
      deleted: false,
    })
      .select(
        "-deleted -deletedAt -createdAt -updatedAt -slug -accessToken -__v",
      )
      .populate("roleId", "permissions");

    if (!admin) return res.redirect("/admin/auth/login");

    const dataAccessTokenPayload: TDataAccessTokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      roleId: admin.roleId.toString(),
    };

    const newAccessToken = await generateAccessToken(
      dataAccessTokenPayload,
      AUTH_ACCESS_TOKEN_SECRET_ADMIN,
      AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN,
    );

    res.cookie("accessTokenAdmin", newAccessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN,
    });

    res.locals.adminAccount = admin;
    return next();
  } catch (error) {
    res.clearCookie("accessTokenAdmin");
    res.clearCookie("refreshTokenAdmin");
    return res.redirect("/admin/auth/login");
  }
};

const authMiddleware = { auth };

export default authMiddleware;
