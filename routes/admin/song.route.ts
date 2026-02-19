import { Router } from "express";
import multer from "multer";
import songController from "../../controllers/admin/song.controller";
import uploadCloud from "../../middlewares/uploadCloud.middleware";

const songRoute: Router = Router();
const upload = multer();

songRoute.get("/songs", songController.getAllSongGet);
songRoute.get("/songs/create", songController.createANewSongGet);
songRoute.post(
  "/songs/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadDiffMultiField,
  songController.createANewSongPost,
);

export default songRoute;
