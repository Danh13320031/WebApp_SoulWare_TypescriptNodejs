import { Router } from "express";
import adminController from "../../controllers/admin/admin.controller";
const adminRoute: Router = Router();

adminRoute.get("/", adminController.adminGet);

export default adminRoute;
