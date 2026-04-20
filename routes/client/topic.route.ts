import { Router } from "express";
import topicController from "../../controllers/client/topic.controller";
import authMiddleware from "../../middlewares/client/auth.middleware";
const topicRoute: Router = Router();

topicRoute.get(
  "/",
  authMiddleware.optionalAuth,
  topicController.getAllTopicGet,
);

export default topicRoute;
