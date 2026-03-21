import { Router } from "express";
import multer from "multer";
import topicController from "../../controllers/admin/topic.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import topicValidate from "../../validators/admin/topic.validate";

const topicRoute: Router = Router();
const upload = multer();

topicRoute.get("/", authMiddleware.auth, topicController.getAllTopicGet);
topicRoute.get(
  "/create",
  authMiddleware.auth,
  topicController.createANewTopicGet,
);
topicRoute.post(
  "/create",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  topicValidate.createANewTopicValidate,
  topicController.createANewTopicPost,
);
topicRoute.get(
  "/update/:topicId",
  authMiddleware.auth,
  topicController.getATopicByIdGet,
);
topicRoute.patch(
  "/update/:topicId",
  authMiddleware.auth,
  upload.single("avatar"),
  uploadCloud.uploadSingerField,
  topicValidate.updateATopicByIdValidate,
  topicController.updateATopicByIdPatch,
);
topicRoute.patch(
  "/soft-delete/:topicId",
  authMiddleware.auth,
  topicController.softRemoveTopicByIdPatch,
);
topicRoute.patch(
  "/change-status/:topicId/:status",
  authMiddleware.auth,
  topicController.changeStatusTopicPatch,
);
topicRoute.patch(
  "/update-multi",
  authMiddleware.auth,
  topicController.updateMultiTopicPatch,
);

export default topicRoute;
