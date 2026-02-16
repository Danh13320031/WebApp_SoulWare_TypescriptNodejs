import { Router } from "express";
import dashboardController from "../../controllers/admin/dashboard.controller";
const dashboardRoute: Router = Router();

dashboardRoute.get("/dashboard", dashboardController.dashboardGet);

export default dashboardRoute;
