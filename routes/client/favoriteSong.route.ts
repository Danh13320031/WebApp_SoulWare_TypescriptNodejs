import { Router } from "express";
import favoriteSongController from "../../controllers/client/favoriteSong.controller";
const favoriteSongRoute: Router = Router();

favoriteSongRoute.get("/", favoriteSongController.getAllFavoriteSongGet);

export default favoriteSongRoute;
