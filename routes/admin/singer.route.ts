import { Router } from "express";
import multer from "multer";
import singerController from "../../controllers/admin/singer.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";

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
  singerController.createANewSingerPost,
);

export default singerRoute;
