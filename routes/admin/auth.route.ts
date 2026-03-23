import { Router } from "express";
import authController from "../../controllers/admin/auth.controller";
import authValidate from "../../validators/admin/auth.validate";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const authRoute: Router = Router();

authRoute.get("/login", authController.loginGet);
authRoute.post("/login", authValidate.loginValidate, authController.loginPost);
authRoute.get("/logout", authController.logoutGet);
authRoute.get(
  "/admin-permissions",
  authMiddleware.auth,
  authController.getAllAdminPermissionGet,
);
authRoute.patch(
  "/admin-permissions/update",
  authMiddleware.auth,
  authController.updateAdminPermissionPatch,
);

export default authRoute;
