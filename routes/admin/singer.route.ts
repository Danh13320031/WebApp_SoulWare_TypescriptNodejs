import { Router } from "express";
import singerController from "../../controllers/admin/singer.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const singerRoute: Router = Router();

singerRoute.get("/", authMiddleware.auth, singerController.getAllSingerGet);

export default singerRoute;
