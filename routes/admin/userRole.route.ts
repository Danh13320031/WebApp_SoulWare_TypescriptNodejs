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
userRoleRoute.get(
  "/update/:userRoleId",
  authMiddleware.auth,
  userRoleController.getAUserRoleByIdGet,
);
userRoleRoute.patch(
  "/update/:userRoleId",
  authMiddleware.auth,
  userRoleValidate.updateUserRoleValidate,
  userRoleController.updateUserRolePatch,
);
userRoleRoute.patch(
  "/soft-delete/:userRoleId",
  authMiddleware.auth,
  userRoleController.softRemoveUserRoleByIdPatch,
);
userRoleRoute.patch(
  "/change-status/:userRoleId/:status",
  authMiddleware.auth,
  userRoleController.changeStatusUserRolePatch,
);
userRoleRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  userRoleController.updateMultiUserRolePatch,
);

export default userRoleRoute;
