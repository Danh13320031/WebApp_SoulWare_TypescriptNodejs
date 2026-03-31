import { Router } from "express";
import userRoleController from "../../controllers/admin/userRole.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const userRoleRoute: Router = Router();

userRoleRoute.get(
  "/",
  authMiddleware.auth,
  userRoleController.getAllUserRoleGet,
);

export default userRoleRoute;
