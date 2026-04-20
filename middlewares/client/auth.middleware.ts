import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT,
  AUTH_ACCESS_TOKEN_SECRET_CLIENT,
  AUTH_COOKIE_OPTIONS,
  AUTH_REFRESH_TOKEN_SECRET_CLIENT,
} from "../../constants/auth.constant";
import generateAccessToken from "../../helpers/generateAccessToken.helper";
import verifyToken from "../../helpers/verifyToken.helper";
import UserModel from "../../models/user.model";
import { TDataAccessTokenPayloadClient } from "../../types/auth.type";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const accessToken = req.cookies["accessTokenUser"];
  const refreshToken = req.cookies["refreshTokenUser"];

  if (!accessToken && !refreshToken) {
    res.locals.userAccount = null;
    return next();
  }

  try {
    if (accessToken) {
      const decoded = verifyToken(
        accessToken,
        AUTH_ACCESS_TOKEN_SECRET_CLIENT,
      ) as JwtPayload;

      const user = await UserModel.findOne({
        _id: decoded.id,
        deleted: false,
      })
        .select(
          "-deleted -deletedAt -createdAt -updatedAt -slug -refreshToken -__v",
        )
        .populate("subscriptionPlanId", "permissions");

      res.locals.userAccount = user || null;
      return next();
    }
  } catch (err: any) {
    if (err.name !== "TokenExpiredError") {
      res.locals.userAccount = null;
      return next();
    }
  }

  if (!refreshToken) {
    res.locals.userAccount = null;
    return next();
  }

  try {
    const decodedRefresh = verifyToken(
      refreshToken,
      AUTH_REFRESH_TOKEN_SECRET_CLIENT,
    ) as JwtPayload;

    const user = await UserModel.findOne({
      _id: decodedRefresh.id,
      refreshToken: refreshToken,
      deleted: false,
    })
      .select(
        "-deleted -deletedAt -createdAt -updatedAt -slug -accessToken -__v",
      )
      .populate("subscriptionPlanId", "permissions");

    if (!user) {
      res.locals.userAccount = null;
      return next();
    }

    const dataAccessTokenPayload: TDataAccessTokenPayloadClient = {
      id: user._id.toString(),
      email: user.email,
      subscriptionPlanId: user.subscriptionPlanId.toString(),
    };

    const newAccessToken = await generateAccessToken(
      dataAccessTokenPayload,
      AUTH_ACCESS_TOKEN_SECRET_CLIENT,
      AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT,
    );

    res.cookie("accessTokenUser", newAccessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT,
    });

    res.locals.userAccount = user;

    return next();
  } catch (error) {
    res.locals.userAccount = null;
    return next();
  }
};

const requiredAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.userAccount) {
    return res.redirect("/auth/register");
  }

  next();
};

const authMiddleware = { optionalAuth, requiredAuth };

export default authMiddleware;
