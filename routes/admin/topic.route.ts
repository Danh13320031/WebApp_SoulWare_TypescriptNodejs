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
topicRoute.get("/update/:topicId", topicController.getATopicByIdGet);
topicRoute.patch(
  "/update/:topicId",
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  topicValidate.updateATopicByIdValidate,
  topicController.updateATopicByIdPatch,
);
topicRoute.patch(
  "/soft-delete/:topicId",
  topicController.softRemoveTopicByIdPatch,
);
topicRoute.patch(
  "/change-status/:topicId/:status",
  topicController.changeStatusTopicPatch,
);
topicRoute.patch("/update-multi", topicController.updateMultiTopicPatch);

export default topicRoute;
