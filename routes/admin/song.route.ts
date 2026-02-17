import { Router } from "express";
import songController from "../../controllers/admin/song.controller";
const songRoute: Router = Router();

songRoute.get("/songs", songController.getAllSongGet);

export default songRoute;
