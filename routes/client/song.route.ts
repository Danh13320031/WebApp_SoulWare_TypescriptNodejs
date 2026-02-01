import { Router } from "express";
import songController from "../../controllers/client/song.controller";
const songRoute: Router = Router();

songRoute.get("/:topicSlug", songController.getAllSongGet);

export default songRoute;
