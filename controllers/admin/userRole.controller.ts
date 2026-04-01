import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import UserRoleModel from "../../models/userRole.model";
import { TPagination, TStatusFilter } from "../../types/index.type";
import {
  TDataUserRoleCreate,
  TDataUserRoleUpdate,
} from "../../types/userRole.type";

// [GET]: /admin/user-roles
const getAllUserRoleGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

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

    // Handle status filter
    let status: string = "";
    if (req.query.status) status = req.query.status as string;
    if (req.query.status === "all") status = "";

    const statusFilter: TStatusFilter[] = handleStatusFilter(status);

    if (status)
      find = {
        ...find,
        status,
      };

    // Handle sort filter
    let sort: string = "";
    if (req.query.sort) sort = req.query.sort as string;

    const sortFilter = handleSortFilter(sort);

    // Handle pagination
    let page: number = 1;
    let limit: number = APP_ADMIN_PAGINATION_LIMIT;
    let type: string = "";

    if (req.query.page) page = Number(req.query.page);
    if (req.query.limit)
      limit = Number(req.query.limit) || APP_ADMIN_PAGINATION_LIMIT;
    if (req.query.type) type = req.query.type as string;

    const count = await UserRoleModel.countDocuments(find);
    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    const userRoleList = await UserRoleModel.find(find)
      .select("-deleted -deletedAt -updatedAt -createdAt -__v")
      .sort(sortFilter.sortOptions)
      .skip(pagination.skipPage)
      .limit(pagination.limitPage);

    res.render("admin/pages/userRole/userRole.view.ejs", {
      pageTitle: "Danh sách vai trò người dùng",
      pathname,
      userRoleList,
      keyword,
      status,
      statusFilter,
      sort: sortFilter.sort,
      pagination,
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

// [GET]: /admin/user-roles/update/:userRoleId
const getAUserRoleByIdGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    const userRoleId: string = req.params.userRoleId as string;

    const userRole = await UserRoleModel.findOne({
      _id: userRoleId,
      deleted: false,
    }).select("-deleted -deletedAt -createdAt -updatedAt -__v");

    if (!userRole) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy vai trò người dùng!",
      });
      return;
    }

    res.render("admin/pages/userRole/update.view.ejs", {
      pageTitle: `Cập nhật vai trò "${userRole.name}"`,
      pathname,
      userRole,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - get user role by id",
    });
    return;
  }
};

// [PATCH]: /admin/user-roles/update/:userRoleId
const updateUserRolePatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userRoleId: string = req.params.userRoleId as string;

    if (!userRoleId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Không tìm thấy vai trò quản trị viên",
      });
      return;
    }

    const dataBodyUpdateUserRole: TDataUserRoleUpdate = {
      name: req.body.name || "",
      status: req.body.status || "active",
      description: req.body.description || "",
    };

    await UserRoleModel.findOneAndUpdate(
      { _id: userRoleId },
      dataBodyUpdateUserRole,
      { new: true },
    );

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật vai trò người dùng thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - update user role",
    });
    return;
  }
};

// [PATCH]: /admin/user-roles/soft-delete/:adminRoleId
const softRemoveUserRoleByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userRoleId: string = req.params.userRoleId as string;

    if (!userRoleId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Không tìm thấy vai trò quản trị viên",
      });
      return;
    }

    await UserRoleModel.findOneAndUpdate(
      { _id: userRoleId },
      { deleted: true },
    );

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xóa vai trò người dùng thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - soft remove admin role by id",
    });
    return;
  }
};

type TUserRoleController = {
  getAllUserRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewUserRoleGet: (req: Request, res: Response) => Promise<void>;
  createANewUserRolePost: (req: Request, res: Response) => Promise<void>;
  getAUserRoleByIdGet: (req: Request, res: Response) => Promise<void>;
  updateUserRolePatch: (req: Request, res: Response) => Promise<void>;
  softRemoveUserRoleByIdPatch: (req: Request, res: Response) => Promise<void>;
};

const UserRoleController: TUserRoleController = {
  getAllUserRoleGet,
  createANewUserRoleGet,
  createANewUserRolePost,
  getAUserRoleByIdGet,
  updateUserRolePatch,
  softRemoveUserRoleByIdPatch,
};

export default UserRoleController;
