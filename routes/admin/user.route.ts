import { Router } from "express";
import userController from "../../controllers/admin/user.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const userRoute: Router = Router();

userRoute.get("/", authMiddleware.auth, userController.getAllUserGet);

export default userRoute;
