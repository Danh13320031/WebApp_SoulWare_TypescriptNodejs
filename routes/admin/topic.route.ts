import { Router } from "express";
import topicController from "../../controllers/admin/topic.controller";
const topicRoute: Router = Router();

topicRoute.get("/topics", topicController.topicGet);

export default topicRoute;
