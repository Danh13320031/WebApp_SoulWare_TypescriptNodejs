import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import AdminRoleModel from "../../models/adminRole.model";
import { TDataAdminRoleCreate } from "../../types/adminRole.type";

// [GET]: /admin/admin-roles
const getAllAdminRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find = { deleted: false };

    const adminRoleList = await AdminRoleModel.find(find).sort({
      position: "desc",
    });

    res.render("admin/pages/adminRole/adminRole.view.ejs", {
      pageTitle: "Danh sách vai trò quản trị viên",
      pathname,
      adminRoleList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - get admin role",
    });
    return;
  }
};

// [GET]: /admin/admin-roles/create
const createANewAdminRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/adminRole/create.view.ejs", {
      pageTitle: "Tạo mới vai trò quản trị viên",
      pathname,
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

// [POST]: /admin/admin-roles/create
const createANewAdminRolePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await AdminRoleModel.countDocuments();

    const dataBodyCreateAdminRole: TDataAdminRoleCreate = {
      name: req.body.name || "",
      status: req.body.status || "active",
      description: req.body.description || "",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
    };

    const newAdminRole = new AdminRoleModel(dataBodyCreateAdminRole);
    await newAdminRole.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới vai trò quản trị viên!",
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

type TAdminRoleController = {
  getAllAdminRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminRolePost: (req: Request, res: Response) => Promise<void>;
};

export const adminRoleController: TAdminRoleController = {
  getAllAdminRoleGet,
  createANewAdminRoleGet,
  createANewAdminRolePost,
};

export default adminRoleController;
