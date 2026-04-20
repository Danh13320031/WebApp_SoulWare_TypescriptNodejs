import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT,
  AUTH_ACCESS_TOKEN_SECRET_CLIENT,
  AUTH_COOKIE_OPTIONS,
  AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_CLIENT,
  AUTH_REFRESH_TOKEN_EXPIRES_IN_CLIENT,
  AUTH_REFRESH_TOKEN_SECRET_CLIENT,
} from "../../constants/auth.constant";
import generateAccessToken from "../../helpers/generateAccessToken.helper";
import generateRefreshToken from "../../helpers/generateRefreshToken.helper";
import hashPassword from "../../helpers/hashPassword.helper";
import SubscriptionPlanModel, {
  ESubscriptionPlanCode,
} from "../../models/subscriptionPlan.model";
import UserModel from "../../models/user.model";
import {
  TDataAccessTokenPayloadClient,
  TDataRegister,
} from "../../types/auth.type";
import comparePassword from "../../helpers/comparePassword.helper";

const registerGet = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render("client/pages/auth/register.view.ejs", {
      pageTitle: "Đăng ký",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - register",
    });
    return;
  }
};

const registerPost = async (req: Request, res: Response): Promise<void> => {
  let password = "";

  if (req.body.password) password = req.body.password;

  try {
    const existingUser = await UserModel.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email người dùng đã được đăng ký! ",
      });
      return;
    }

    const subscriptionPlan = await SubscriptionPlanModel.findOne({
      code: ESubscriptionPlanCode.FREE,
      deleted: false,
    });

    if (!subscriptionPlan) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Không tìm thấy gói người dùng! ",
      });
      return;
    }

    const dataRegister: TDataRegister = {
      email: req.body.email ? req.body.email : null,
      phone: req.body.phone ? req.body.phone : null,
      password: await hashPassword(password),
      confirmPassword: req.body.confirmPassword
        ? req.body.confirmPassword
        : null,
      fullName: req.body.fullName ? req.body.fullName : null,
      subscriptionPlanId: subscriptionPlan._id.toString(),
    };

    const newUser = new UserModel(dataRegister);
    await newUser.save();

    const accessTokenPayload: TDataAccessTokenPayloadClient = {
      id: newUser._id.toString(),
      email: newUser.email,
      subscriptionPlanId: newUser.subscriptionPlanId
        ? newUser.subscriptionPlanId.toString()
        : "",
    };

    const accessToken = generateAccessToken(
      accessTokenPayload,
      AUTH_ACCESS_TOKEN_SECRET_CLIENT,
      AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT,
    );
    const refreshToken = generateRefreshToken(
      { id: newUser._id.toString() },
      AUTH_REFRESH_TOKEN_SECRET_CLIENT,
      AUTH_REFRESH_TOKEN_EXPIRES_IN_CLIENT,
    );

    res.cookie("accessTokenUser", accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT,
    });
    res.cookie("refreshTokenUser", refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_CLIENT,
    });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Register successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - register",
    });
    return;
  }
};

const loginGet = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render("client/pages/auth/login.view.ejs", {
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

const loginPost = async (req: Request, res: Response): Promise<void> => {
  let password = "";

  if (req.body.password) password = req.body.password;

  try {
    const user = await UserModel.findOne({
      email: req.body.email,
      deleted: false,
    }).select("email password subscriptionPlanId");

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email người dùng chưa đăng ký!",
      });
      return;
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email hoặc mật khẩu không chính xác!",
      });
      return;
    }

    const accessTokenPayload: TDataAccessTokenPayloadClient = {
      id: user._id.toString(),
      email: user.email,
      subscriptionPlanId: user.subscriptionPlanId
        ? user.subscriptionPlanId.toString()
        : "",
    };

    const accessToken = generateAccessToken(
      accessTokenPayload,
      AUTH_ACCESS_TOKEN_SECRET_CLIENT,
      AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT,
    );
    const refreshToken = generateRefreshToken(
      { id: user._id.toString() },
      AUTH_REFRESH_TOKEN_SECRET_CLIENT,
      AUTH_REFRESH_TOKEN_EXPIRES_IN_CLIENT,
    );

    res.cookie("accessTokenUser", accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT,
    });
    res.cookie("refreshTokenUser", refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_CLIENT,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Login successfully",
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

type TAuthController = {
  registerGet: (req: Request, res: Response) => Promise<void>;
  registerPost: (req: Request, res: Response) => Promise<void>;
  loginGet: (req: Request, res: Response) => Promise<void>;
  loginPost: (req: Request, res: Response) => Promise<void>;
};

const authController: TAuthController = {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
};

export default authController;
