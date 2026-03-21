import { Router } from "express";
import dashboardController from "../../controllers/admin/dashboard.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const dashboardRoute: Router = Router();

dashboardRoute.get("/", authMiddleware.auth, dashboardController.dashboardGet);

export default dashboardRoute;
