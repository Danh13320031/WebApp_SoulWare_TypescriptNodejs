import { Router } from "express";
import adminRoleController from "../../controllers/admin/adminRole.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import adminRoleValidate from "../../validators/admin/adminRole.validate";

const adminRoleRoute: Router = Router();

adminRoleRoute.get(
  "/",
  authMiddleware.auth,
  adminRoleController.getAllAdminRoleGet,
);
adminRoleRoute.get("/create", adminRoleController.createANewAdminRoleGet);
adminRoleRoute.post(
  "/create",
  authMiddleware.auth,
  adminRoleValidate.createANewAdminRoleValidate,
  adminRoleController.createANewAdminRolePost,
);
adminRoleRoute.get(
  "/update/:adminRoleId",
  authMiddleware.auth,
  adminRoleController.getAAdminRoleByIdGet,
);
adminRoleRoute.patch(
  "/update/:adminRoleId",
  authMiddleware.auth,
  adminRoleValidate.updateAdminRolePatchValidate,
  adminRoleController.updateAdminRolePatch,
);
adminRoleRoute.patch(
  "/soft-delete/:adminRoleId",
  authMiddleware.auth,
  adminRoleController.softRemoveAdminRoleByIdPatch,
);
adminRoleRoute.patch(
  "/change-status/:adminRoleId/:status",
  authMiddleware.auth,
  adminRoleController.changeStatusAdminRolePatch,
);
adminRoleRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  adminRoleController.updateMultiAdminRolePatch,
);

export default adminRoleRoute;
