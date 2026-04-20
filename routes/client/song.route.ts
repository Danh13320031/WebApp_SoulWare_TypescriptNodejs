import { Router } from "express";
import songController from "../../controllers/client/song.controller";
import authMiddleware from "../../middlewares/client/auth.middleware";
const songRoute: Router = Router();

songRoute.get(
  "/:topicSlug",
  authMiddleware.optionalAuth,
  songController.getAllSongGet,
);
songRoute.get(
  "/detail/:songSlug",
  authMiddleware.optionalAuth,
  songController.getOneSongGet,
);
songRoute.patch("/like/:type/:songId", songController.likeSongPatch);
songRoute.patch("/favorite/:type/:songId", songController.favoriteSongPatch);
songRoute.get("/listen/:songId", songController.listenToSongOncePatch);

export default songRoute;
