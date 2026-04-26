import { Router } from "express";
import multer from "multer";
import userController from "../../controllers/client/user.controller";
import authMiddleware from "../../middlewares/client/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import userValidate from "../../validators/client/user.validate";

const userRoute: Router = Router();
const upload = multer();

userRoute.get(
  "/profile",
  authMiddleware.optionalAuth,
  authMiddleware.requiredAuth,
  userController.showProfileGet,
);
userRoute.patch(
  "/profile",
  authMiddleware.optionalAuth,
  authMiddleware.requiredAuth,
  upload.single("avatar"),
  userValidate.updateProfileValidate,
  uploadCloud.uploadSingerField,
  userController.updateProfilePatch,
);

export default userRoute;
