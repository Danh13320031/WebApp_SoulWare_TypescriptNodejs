import { Router } from "express";
import multer from "multer";
import singerGroupController from "../../controllers/admin/singerGroup.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";

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
  singerGroupController.createANewSingerGroupPost,
);

export default singerGroupRoute;
