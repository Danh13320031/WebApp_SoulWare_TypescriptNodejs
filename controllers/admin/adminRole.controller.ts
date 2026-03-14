import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import AdminRoleModel from "../../models/adminRole.model";
import { TDataAdminRoleCreate } from "../../types/adminRole.type";
import { TPagination } from "../../types/index.type";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";

// [GET]: /admin/admin-roles
const getAllAdminRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    // Handle pagination
    let page: number = 1;
    let limit: number = APP_ADMIN_PAGINATION_LIMIT;
    let type: string = "";

    if (req.query.page) page = Number(req.query.page);
    if (req.query.limit)
      limit = Number(req.query.limit) || APP_ADMIN_PAGINATION_LIMIT;
    if (req.query.type) type = req.query.type as string;

    const count = await AdminRoleModel.countDocuments(find);
    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    // Handle search filter
    let keyword: string = "";
    let keywordRegex: RegExp = new RegExp("", "i");
    let slugRegex: RegExp = new RegExp("", "i");

    if (req.query.keyword) keyword = req.query.keyword as string;
    if (keyword) {
      keywordRegex = new RegExp(keyword, "i");
      slugRegex = new RegExp(convertTextToSlug(keyword), "i");

      find = {
        ...find,
        $or: [
          { name: { $regex: keywordRegex } },
          { slug: { $regex: slugRegex } },
        ],
      };
    }

    const adminRoleList = await AdminRoleModel.find(find).sort({
      position: "desc",
    });

    res.render("admin/pages/adminRole/adminRole.view.ejs", {
      pageTitle: "Danh sách vai trò quản trị viên",
      pathname,
      adminRoleList,
      pagination,
      keyword,
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
