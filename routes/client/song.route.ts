import { Router } from "express";
import songController from "../../controllers/client/song.controller";
const songRoute: Router = Router();

songRoute.get("/:topicSlug", songController.getAllTopicGet);

export default songRoute;
