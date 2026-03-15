import { Router } from "express";
import adminRoleController from "../../controllers/admin/adminRole.controller";
import adminRoleValidate from "../../validators/admin/adminRole.validate";

const adminRoleRoute: Router = Router();

adminRoleRoute.get("/", adminRoleController.getAllAdminRoleGet);
adminRoleRoute.get("/create", adminRoleController.createANewAdminRoleGet);
adminRoleRoute.post(
  "/create",
  adminRoleValidate.createANewAdminRoleValidate,
  adminRoleController.createANewAdminRolePost,
);
adminRoleRoute.get(
  "/update/:adminRoleId",
  adminRoleController.getAAdminRoleByIdGet,
);
adminRoleRoute.patch(
  "/update/:adminRoleId",
  adminRoleValidate.updateAdminRolePatchValidate,
  adminRoleController.updateAdminRolePatch,
);
adminRoleRoute.patch(
  "/soft-delete/:adminRoleId",
  adminRoleController.softRemoveAdminRoleByIdPatch,
);

export default adminRoleRoute;
