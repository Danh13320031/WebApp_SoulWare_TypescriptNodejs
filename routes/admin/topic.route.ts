import { Router } from "express";
import multer from "multer";
import topicController from "../../controllers/admin/topic.controller";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import topicValidate from "../../validators/admin/topic.validate";

const topicRoute: Router = Router();
const upload = multer();

topicRoute.get("/", topicController.getAllTopicGet);
topicRoute.get("/create", topicController.createANewTopicGet);
topicRoute.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  topicValidate.createANewTopicValidate,
  topicController.createANewTopicPost,
);

export default topicRoute;
