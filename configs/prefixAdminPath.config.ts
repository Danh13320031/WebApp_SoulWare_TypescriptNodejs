import { Express } from "express";
import { APP_PREFIX_ADMIN } from "../constants/app.constant";

const setPrefixAdminPathConfig = (app: Express): void => {
  app.locals.prefixAdminPath = APP_PREFIX_ADMIN as string;
};

export default setPrefixAdminPathConfig;
