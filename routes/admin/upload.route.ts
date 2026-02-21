import { Router } from "express";
import multer from "multer";
import uploadController from "../../controllers/admin/upload.controller";
import uploadCloud from "../../middlewares/uploadCloud.middleware";

const uploadRoute: Router = Router();
const upload = multer();

uploadRoute.post(
  "/",
  upload.single("file"),
  uploadCloud.uploadSingerField,
  uploadController.uploadImageFromTinyMce,
);

export default uploadRoute;
