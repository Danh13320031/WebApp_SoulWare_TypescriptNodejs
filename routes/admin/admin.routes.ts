import { Router } from "express";
import multer from "multer";
import adminController from "../../controllers/admin/admin.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import adminValidate from "../../validators/admin/admin.validate";

const adminRoute: Router = Router();
const upload = multer();

adminRoute.get("/", authMiddleware.auth, adminController.adminGet);
adminRoute.get(
  "/create",
  authMiddleware.auth,
  adminController.createANewAdminGet,
);
adminRoute.post(
  "/create",
  authMiddleware.auth,
  upload.single("avatar"),
  adminValidate.createANewAdminValidate,
  uploadCloud.uploadSingerField,
  adminController.createANewAdminPost,
);
adminRoute.get(
  "/update/:adminId",
  authMiddleware.auth,
  adminController.getAAdminByIdGet,
);
adminRoute.patch(
  "/update/:adminId",
  authMiddleware.auth,
  upload.single("avatar"),
  adminValidate.updateAAdminByIdValidate,
  uploadCloud.uploadSingerField,
  adminController.updateAAdminByIdPatch,
);
adminRoute.patch(
  "/soft-delete/:adminId",
  authMiddleware.auth,
  adminController.softRemoveAdminByIdPatch,
);
adminRoute.patch(
  "/change-status/:adminId/:status",
  authMiddleware.auth,
  adminController.changeStatusAdminPatch,
);
adminRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  adminController.updateMultiAdminPatch,
);

export default adminRoute;
