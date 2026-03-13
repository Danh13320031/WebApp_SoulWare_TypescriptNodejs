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

export default adminRoute;
