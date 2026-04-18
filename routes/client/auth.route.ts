import { Router } from "express";
import authController from "../../controllers/client/auth.controller";
const authRoute: Router = Router();

authRoute.get("/register", authController.registerGet);
authRoute.post("/register", authController.registerPost);

export default authRoute;
