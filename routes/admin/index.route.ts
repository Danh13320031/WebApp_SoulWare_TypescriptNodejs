import { Express } from "express";
import { APP_PREFIX_ADMIN } from "../../constants/app.constant";
import dashboardRoute from "./dashboard.route";
import songRoute from "./song.route";
import topicRoute from "./topic.route";
import uploadRoute from "./upload.route";

const createAdminRoute = (app: Express): void => {
  const pathAdmin: string = APP_PREFIX_ADMIN as string;

  app.use(`${pathAdmin}/dashboard`, dashboardRoute);
  app.use(`${pathAdmin}/topics`, topicRoute);
  app.use(`${pathAdmin}/songs`, songRoute);
  app.use(`${pathAdmin}/upload`, uploadRoute);

  return;
};

export default createAdminRoute;
