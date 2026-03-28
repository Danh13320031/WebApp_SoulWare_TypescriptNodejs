import { Router } from "express";
import multer from "multer";
import singerGroupController from "../../controllers/admin/singerGroup.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import singerGroupValidate from "../../validators/admin/singerGroup.validate";

const singerGroupRoute: Router = Router();
const upload = multer();

singerGroupRoute.get(
  "/",
  authMiddleware.auth,
  singerGroupController.singerGroupGet,
);
singerGroupRoute.get(
  "/create",
  authMiddleware.auth,
  singerGroupController.createANewSingerGroupGet,
);

singerGroupRoute.post(
  "/create",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  singerGroupValidate.createANewSingerGroupValidate,
  singerGroupController.createANewSingerGroupPost,
);
singerGroupRoute.get(
  "/update/:singerGroupId",
  authMiddleware.auth,
  singerGroupController.getASingerGroupByIdGet,
);

singerGroupRoute.patch(
  "/update/:singerGroupId",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  singerGroupValidate.updateASingerGroupByIdValidate,
  singerGroupController.updateASingerGroupByIdPatch,
);

export default singerGroupRoute;
