import { Express } from "express";
import dashboardRoute from "./dashboard.route";

const createAdminRoute = (app: Express): void => {
  app.use("/admin/dashboard", dashboardRoute);
};

export default createAdminRoute;
