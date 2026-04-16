import { Router } from "express";
import subscriptionPlanController from "../../controllers/admin/subscriptionPlan.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
const subscriptionPlanRoute: Router = Router();

subscriptionPlanRoute.get(
  "/",
  authMiddleware.auth,
  subscriptionPlanController.getAllSubscriptionPlanGet,
);

export default subscriptionPlanRoute;
