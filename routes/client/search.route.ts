import { Router } from "express";
import searchController from "../../controllers/client/search.controller";
const searchRoute: Router = Router();

searchRoute.get("/result", searchController.getAllSearchResultGet);

export default searchRoute;
