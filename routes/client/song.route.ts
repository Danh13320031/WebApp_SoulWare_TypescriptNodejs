import { Router } from "express";
import songController from "../../controllers/client/song.controller";
const songRoute: Router = Router();

songRoute.get("/:topicSlug", songController.getAllSongGet);
songRoute.get("/detail/:songSlug", songController.getOneSongGet);

export default songRoute;
