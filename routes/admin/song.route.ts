import { Router } from "express";
import multer from "multer";
import songController from "../../controllers/admin/song.controller";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import songValidate from "../../validators/admin/song.validate";

const songRoute: Router = Router();
const upload = multer();

songRoute.get("", songController.getAllSongGet);
songRoute.get("/create", songController.createANewSongGet);
songRoute.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadDiffMultiField,
  songValidate.createANewSongValidate,
  songController.createANewSongPost,
);
songRoute.get("/update/:songId", songController.getASongByIdGet);
songRoute.patch(
  "/update/:songId",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadDiffMultiField,
  songValidate.updateASongByIdValidate,
  songController.updateASongByIdPatch,
);

export default songRoute;
