import jwt, { SignOptions } from "jsonwebtoken";
import { TDataRefreshTokenPayload } from "../types/auth.type";

const generateRefreshToken = (
  payload: TDataRefreshTokenPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  const refreshTokenStr = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });

  return refreshTokenStr;
};

export default generateRefreshToken;
