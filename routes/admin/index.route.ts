import { Express } from "express";
import { APP_PREFIX_ADMIN } from "../../constants/app.constant";
import adminRoute from "./admin.routes";
import adminRoleRoute from "./adminRole.route";
import authRoute from "./auth.route";
import dashboardRoute from "./dashboard.route";
import singerRoute from "./singer.route";
import singerGroupRoute from "./singerGroup.route";
import songRoute from "./song.route";
import topicRoute from "./topic.route";
import uploadRoute from "./upload.route";
import userRoute from "./user.route";
import userRoleRoute from "./userRole.route";

const createAdminRoute = (app: Express): void => {
  const pathAdmin: string = APP_PREFIX_ADMIN as string;

  app.use(`${pathAdmin}/dashboard`, dashboardRoute);
  app.use(`${pathAdmin}/topics`, topicRoute);
  app.use(`${pathAdmin}/songs`, songRoute);
  app.use(`${pathAdmin}/singers`, singerRoute);
  app.use(`${pathAdmin}/singer-groups`, singerGroupRoute);
  app.use(`${pathAdmin}/upload`, uploadRoute);
  app.use(`${pathAdmin}/admins`, adminRoute);
  app.use(`${pathAdmin}/admin-roles`, adminRoleRoute);
  app.use(`${pathAdmin}/users`, userRoute);
  app.use(`${pathAdmin}/user-roles`, userRoleRoute);
  app.use(`${pathAdmin}/auth`, authRoute);

  return;
};

export default createAdminRoute;
