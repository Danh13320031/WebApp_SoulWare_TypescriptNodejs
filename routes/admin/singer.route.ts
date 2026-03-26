import { Router } from "express";
import multer from "multer";
import singerController from "../../controllers/admin/singer.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import singerValidate from "../../validators/admin/singer.validate";

const singerRoute: Router = Router();
const upload = multer();

singerRoute.get("/", authMiddleware.auth, singerController.getAllSingerGet);
singerRoute.get(
  "/create",
  authMiddleware.auth,
  singerController.createANewSingerGet,
);
singerRoute.post(
  "/create",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  singerValidate.createANewSingerValidate,
  singerController.createANewSingerPost,
);
singerRoute.get(
  "/update/:singerId",
  authMiddleware.auth,
  singerController.getASingerByIdGet,
);
singerRoute.patch(
  "/update/:singerId",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  singerValidate.updateASingerByIdValidate,
  singerController.updateASingerByIdPatch,
);
singerRoute.patch(
  "/soft-delete/:singerId",
  authMiddleware.auth,
  singerController.softRemoveASingerByIdPatch,
);
singerRoute.patch(
  "/change-status/:singerId/:status",
  authMiddleware.auth,
  singerController.changeStatusSingerPatch,
);
singerRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  singerController.updateMultiSingerPatch,
);

export default singerRoute;
