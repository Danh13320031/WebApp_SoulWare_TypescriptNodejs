import { Router } from "express";
import topicController from "../../controllers/admin/topic.controller";
const topicRoute: Router = Router();

topicRoute.get("/topics", topicController.getAllTopicGet);

export default topicRoute;
