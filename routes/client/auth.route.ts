import { Router } from "express";
import authController from "../../controllers/client/auth.controller";
import authValidate from "../../validators/client/auth.validate";
import authMiddleware from "../../middlewares/client/auth.middleware";
const authRoute: Router = Router();

authRoute.get("/register", authController.registerGet);
authRoute.post(
  "/register",
  authValidate.registerValidate,
  authController.registerPost,
);
authRoute.get("/login", authController.loginGet);
authRoute.post("/login", authValidate.loginValidate, authController.loginPost);
authRoute.get("/logout", authMiddleware.optionalAuth, authController.logoutGet);

export default authRoute;
