import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import hashPassword from "../../helpers/hashPassword.helper";
import { TDataBodyUpdateProfile } from "../../types/user.type";
import UserModel from "../../models/user.model";

const showProfileGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.userAccount ? res.locals.userAccount : null;

    if (!user) {
      res.redirect("/auth/login");
      return;
    }

    res.render("client/pages/user/profile.view.ejs", {
      pageTitle: "Thông tin cá nhân",
      keyword: "",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - show profile",
    });
    return;
  }
};

const updateProfilePatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const hashedPassword = req.body.password
      ? await hashPassword(req.body.password)
      : null;

    const user = await UserModel.findOne({ _id: res.locals.userAccount._id });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy người dùng! ",
      });
      return;
    }

    const dataBodyUpdateProfile: TDataBodyUpdateProfile = {
      fullName: req.body.fullName ? req.body.fullName : user.fullName,
      email: req.body.email ? req.body.email : user.email,
      password: hashedPassword ? hashedPassword : user.password,
      phone: req.body.phone ? req.body.phone : user.phone,
      avatar: req.body.avatar ? req.body.avatar : user.avatar,
      birthday: req.body.birthday ? req.body.birthday : user.birthday,
      address: req.body.address ? req.body.address : user.address,
      description: req.body.description
        ? req.body.description
        : user.description,
    };

    await UserModel.updateOne(
      { _id: res.locals.userAccount._id },
      dataBodyUpdateProfile,
    );

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật thống tin người dùng thành công!",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - update profile",
    });
    return;
  }
};

type TUSerController = {
  showProfileGet: (req: Request, res: Response) => Promise<void>;
  updateProfilePatch: (req: Request, res: Response) => Promise<void>;
};

const userController: TUSerController = {
  showProfileGet,
  updateProfilePatch,
};

export default userController;
