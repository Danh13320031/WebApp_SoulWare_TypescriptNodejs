import jwt, { SignOptions } from "jsonwebtoken";
import {
  TDataAccessTokenPayload,
  TDataAccessTokenPayloadClient,
} from "../types/auth.type";

const generateAccessToken = (
  payload: TDataAccessTokenPayload | TDataAccessTokenPayloadClient,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  const accessTokenStr = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });

  return accessTokenStr;
};

export default generateAccessToken;
