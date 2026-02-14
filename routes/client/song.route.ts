import { Router } from "express";
import songController from "../../controllers/client/song.controller";
const songRoute: Router = Router();

songRoute.get("/:topicSlug", songController.getAllSongGet);
songRoute.get("/detail/:songSlug", songController.getOneSongGet);
songRoute.patch("/like/:type/:songId", songController.likeSongPatch);
songRoute.patch("/favorite/:type/:songId", songController.favoriteSongPatch);
songRoute.get("/listen/:songId", songController.listenToSongOncePatch);

export default songRoute;
