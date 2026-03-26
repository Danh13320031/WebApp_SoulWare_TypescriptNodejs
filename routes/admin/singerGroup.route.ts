import { Router } from "express";
import singerGroupController from "../../controllers/admin/singerGroup.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const singerGroupRoute: Router = Router();

singerGroupRoute.get(
  "/",
  authMiddleware.auth,
  singerGroupController.singerGroupGet,
);

export default singerGroupRoute;
