import { Router } from "express";
import favoriteSongController from "../../controllers/client/favoriteSong.controller";
import authMiddleware from "../../middlewares/client/auth.middleware";
const favoriteSongRoute: Router = Router();

favoriteSongRoute.get(
  "/",
  authMiddleware.optionalAuth,
  favoriteSongController.getAllFavoriteSongGet,
);

export default favoriteSongRoute;
