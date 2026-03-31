import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import UserModel from "../../models/user.model";
import hashPassword from "../../helpers/hashPassword.helper";
import { TDataBodyCreateUser } from "../../types/user.type";

// [GET]: /admin/users
const getAllUserGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/user/user.view.ejs", {
      pageTitle: "Quản lý người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Error",
      message: "Lỗi khi lấy danh sách người dùng",
    });
    return;
  }
};

// [GET]: /admin/users/create
const createANewUserGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/user/create.view.ejs", {
      pageTitle: "Tạo mới người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - create new user",
    });
    return;
  }
};

// [POST]: /admin/users/create
const createANewUserPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await UserModel.countDocuments();
    let avatar: string = "";
    let password: string = "";
    let fullName: string = "";

    if (req.body.avatar) avatar = req.body.avatar;
    if (req.body.password) password = await hashPassword(req.body.password);
    if (req.body.name) fullName = req.body.name;

    const existingUser = await UserModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email người dùng đã được đăng ký!",
      });
      return;
    }

    const dataBodyCreateUser: TDataBodyCreateUser = {
      email: req.body.email ? req.body.email : "",
      password: password ? password : "",
      phone: req.body.phone ? req.body.phone : "",
      avatar: avatar ? avatar : "",
      fullName: fullName ? fullName : "",
      birthday: req.body.birthday ? req.body.birthday : null,
      address: req.body.address ? req.body.address : null,
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : "active",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      roleId: req.body.roleId ? req.body.roleId : null,
    };

    const newUser = new UserModel(dataBodyCreateUser);
    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới người dùng thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - create new user",
    });
    return;
  }
};

type IUserController = {
  getAllUserGet: (req: Request, res: Response) => Promise<void>;
  createANewUserGet: (req: Request, res: Response) => Promise<void>;
  createANewUserPost: (req: Request, res: Response) => Promise<void>;
};

const userController: IUserController = {
  getAllUserGet,
  createANewUserGet,
  createANewUserPost,
};

export default userController;
