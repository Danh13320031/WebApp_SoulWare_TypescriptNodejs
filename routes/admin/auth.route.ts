import { Router } from "express";
import authController from "../../controllers/admin/auth.controller";
import authValidate from "../../validators/admin/auth.validate";
const authRoute: Router = Router();

authRoute.get("/login", authController.loginGet);
authRoute.post("/login", authValidate.loginValidate, authController.loginPost);

export default authRoute;
