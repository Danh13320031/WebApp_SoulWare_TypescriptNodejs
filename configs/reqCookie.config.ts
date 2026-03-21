import cookieParser from "cookie-parser";
import { Express } from "express";

const reqCookieConfig = (app: Express) => {
  app.use(cookieParser());
};

export default reqCookieConfig;
