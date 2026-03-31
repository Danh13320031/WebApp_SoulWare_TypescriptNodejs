import { Router } from "express";
import userRoleController from "../../controllers/admin/userRole.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import userRoleValidate from "../../validators/admin/userRole.validate";
const userRoleRoute: Router = Router();

userRoleRoute.get(
  "/",
  authMiddleware.auth,
  userRoleController.getAllUserRoleGet,
);
userRoleRoute.get(
  "/create",
  authMiddleware.auth,
  userRoleController.createANewUserRoleGet,
);
userRoleRoute.post(
  "/create",
  authMiddleware.auth,
  userRoleValidate.createANewUserRoleValidate,
  userRoleController.createANewUserRolePost,
);

export default userRoleRoute;
