import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import hashPassword from "../../helpers/hashPassword.helper";
import AdminModel from "../../models/admin.model";
import { TDataBodyCreateAdmin } from "../../types/admin.type";
import AdminRoleModel from "../../models/adminRole.model";

// [GET]: /admin/admin
const adminGet = async (req: Request, res: Response): Promise<void> => {
  const pathname = activeSider(req.originalUrl);
  let find = { deleted: false };

  const adminList = await AdminModel.find(find)
    .select("-deleted -deletedAt")
    .populate("roleId", "name")
    .sort({ position: "desc" });

  res.render("admin/pages/admin/admin.view.ejs", {
    pageTitle: "Danh sách quản trị viên",
    pathname,
    adminList,
  });
};

// [GET]: /admin/admins/create
const createANewAdminGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find = { deleted: false };

    const adminRoleList = await AdminRoleModel.find(find).select("name");

    res.render("admin/pages/admin/create.view.ejs", {
      pageTitle: "Tạo mới quản trị viên",
      pathname,
      adminRoleList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - create new admin",
    });
    return;
  }
};

// [POST]: /admin/admins/create
const createANewAdminPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await AdminModel.countDocuments();
    let avatar: string = "";
    let password: string = "";
    let fullName: string = "";

    if (req.body.avatar) avatar = req.body.avatar;
    if (req.body.password) password = await hashPassword(req.body.password);
    if (req.body.name) fullName = req.body.name;

    const dataBodyCreateAdmin: TDataBodyCreateAdmin = {
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
      roleId: req.body.roleId ? req.body.roleId : "",
    };

    const newAdmin = new AdminModel(dataBodyCreateAdmin);
    await newAdmin.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới quản trị viên thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - create new admin",
    });
    return;
  }
};

type TAdminController = {
  adminGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminPost: (req: Request, res: Response) => Promise<void>;
};

export const adminController: TAdminController = {
  adminGet,
  createANewAdminGet,
  createANewAdminPost,
};

export default adminController;
