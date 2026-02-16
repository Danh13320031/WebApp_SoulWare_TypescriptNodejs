import { Express } from "express";
import { APP_PREFIX_ADMIN } from "../../constants/app.constant";
import dashboardRoute from "./dashboard.route";

const createAdminRoute = (app: Express): void => {
  const pathAdmin: string = APP_PREFIX_ADMIN as string;

  app.use(`${pathAdmin}`, dashboardRoute);
};

export default createAdminRoute;
