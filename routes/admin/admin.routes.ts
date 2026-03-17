import { Router } from "express";
import multer from "multer";
import adminController from "../../controllers/admin/admin.controller";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import adminValidate from "../../validators/admin/admin.validate";

const adminRoute: Router = Router();
const upload = multer();

adminRoute.get("/", adminController.adminGet);
adminRoute.get("/create", adminController.createANewAdminGet);
adminRoute.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  adminValidate.createANewAdminValidate,
  adminController.createANewAdminPost,
);
adminRoute.get("/update/:adminId", adminController.getAAdminByIdGet);
adminRoute.patch(
  "/update/:adminId",
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  adminValidate.updateAAdminByIdValidate,
  adminController.updateAAdminByIdPatch,
);
adminRoute.patch(
  "/soft-delete/:adminId",
  adminController.softRemoveAdminByIdPatch,
);
adminRoute.patch(
  "/change-status/:adminId/:status",
  adminController.changeStatusAdminPatch,
);
adminRoute.patch("/update-multi", adminController.updateMultiAdminPatch);

export default adminRoute;
