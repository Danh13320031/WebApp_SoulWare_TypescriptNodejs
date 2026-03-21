import "dotenv/config";
import { SignOptions } from "jsonwebtoken";
import { TAuthCookieOptions } from "../types/auth.type";

export const AUTH_SALT_ROUND: number = 10;

export const AUTH_REFRESH_TOKEN_SECRET_ADMIN: string = process.env
  .AUTH_REFRESH_TOKEN_SECRET_ADMIN as string;
export const AUTH_REFRESH_TOKEN_EXPIRES_IN_ADMIN = process.env
  .AUTH_REFRESH_TOKEN_EXPIRES_IN_ADMIN as SignOptions["expiresIn"];

export const AUTH_ACCESS_TOKEN_SECRET_ADMIN: string = process.env
  .AUTH_ACCESS_TOKEN_SECRET_ADMIN as string;
export const AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN = process.env
  .AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN as SignOptions["expiresIn"];

export const AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_ADMIN: number =
  1000 * 60 * 60 * 24 * 3;
export const AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN: number = 1000 * 60 * 15;

export const AUTH_COOKIE_OPTIONS: TAuthCookieOptions = {
  httpOnly: true,
  // secure: true,
  sameSite: "strict",
};
