import { Router } from "express";
import multer from "multer";
import songController from "../../controllers/admin/song.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import songValidate from "../../validators/admin/song.validate";

const songRoute: Router = Router();
const upload = multer();

songRoute.get("", authMiddleware.auth, songController.getAllSongGet);
songRoute.get("/create", songController.createANewSongGet);
songRoute.post(
  "/create",
  authMiddleware.auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadDiffMultiField,
  songValidate.createANewSongValidate,
  songController.createANewSongPost,
);
songRoute.get(
  "/update/:songId",
  authMiddleware.auth,
  songController.getASongByIdGet,
);
songRoute.patch(
  "/update/:songId",
  authMiddleware.auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadDiffMultiField,
  songValidate.updateASongByIdValidate,
  songController.updateASongByIdPatch,
);
songRoute.patch(
  "/soft-delete/:songId",
  authMiddleware.auth,
  songController.softRemoveASongByIdDelete,
);
songRoute.patch(
  "/change-status/:songId/:status",
  authMiddleware.auth,
  songController.changeStatusSongPatch,
);
songRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  songController.updateMultiSongPatch,
);

export default songRoute;
