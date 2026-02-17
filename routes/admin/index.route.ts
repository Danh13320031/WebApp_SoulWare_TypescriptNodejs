import { Express } from "express";
import { APP_PREFIX_ADMIN } from "../../constants/app.constant";
import dashboardRoute from "./dashboard.route";
import topicRoute from "./topic.route";

const createAdminRoute = (app: Express): void => {
  const pathAdmin: string = APP_PREFIX_ADMIN as string;

  app.use(`${pathAdmin}`, dashboardRoute);
  app.use(`${pathAdmin}`, topicRoute);
};

export default createAdminRoute;
