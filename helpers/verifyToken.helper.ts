import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string): JwtPayload | string => {
  const decoded = jwt.verify(token, secret);

  return decoded;
};

export default verifyToken;
