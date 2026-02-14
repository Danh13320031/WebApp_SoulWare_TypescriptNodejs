import { Router } from "express";
import searchController from "../../controllers/client/search.controller";
const searchRoute: Router = Router();

searchRoute.get("/:type", searchController.getAllSearchResultGet);

export default searchRoute;
