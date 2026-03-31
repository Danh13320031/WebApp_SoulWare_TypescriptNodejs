import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import UserRoleModel from "../../models/userRole.model";
import { TDataUserRoleCreate } from "../../types/userRole.type";

// [GET]: /admin/user-roles
const getAllUserRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/userRole/userRole.view.ejs", {
      pageTitle: "Danh sách vai trò người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi khi lấy danh sách vai trò người dùng",
    });
    return;
  }
};

// [GET]: /admin/user-roles/create4
const createANewUserRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/userRole/create.view.ejs", {
      pageTitle: "Tạo mới vai trò người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi khi tạo mới vai trò người dùng",
    });
    return;
  }
};

// [POST]: /admin/user-roles/create
const createANewUserRolePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await UserRoleModel.countDocuments();

    const dataBodyCreateUserRole: TDataUserRoleCreate = {
      name: req.body.name || "",
      status: req.body.status || "active",
      description: req.body.description || "",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
    };

    const newUserRole = new UserRoleModel(dataBodyCreateUserRole);
    await newUserRole.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới vai trò người dùng thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - create new admin role",
    });
    return;
  }
};

type TUserRoleController = {
  getAllUserRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewUserRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewUserRolePost: (req: Request, res: Response) => Promise<void>;
};

const UserRoleController: TUserRoleController = {
  getAllUserRoleGet,
  createANewUserRoleGet,
  createANewUserRolePost,
};

export default UserRoleController;
