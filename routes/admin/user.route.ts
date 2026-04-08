import { Router } from "express";
import multer from "multer";
import userController from "../../controllers/admin/user.controller";
import authMiddleware from "../../middlewares/admin/auth.middleware";
import uploadCloud from "../../middlewares/uploadCloud.middleware";
import userValidate from "../../validators/admin/user.validate";

const userRoute: Router = Router();
const upload = multer();

userRoute.get("/", authMiddleware.auth, userController.getAllUserGet);
userRoute.get("/create", authMiddleware.auth, userController.createANewUserGet);
userRoute.post(
  "/create",
  authMiddleware.auth,
  upload.single("avatar"),
  userValidate.createANewUserValidate,
  uploadCloud.uploadSingerField,
  userController.createANewUserPost,
);
userRoute.get(
  "/update/:userId",
  authMiddleware.auth,
  userController.getAUserByIdGet,
);
userRoute.patch(
  "/update/:userId",
  authMiddleware.auth,
  upload.single("avatar"),
  userValidate.updateAUserByIdValidate,
  uploadCloud.uploadSingerField,
  userController.updateAUserByIdPatch,
);

export default userRoute;
