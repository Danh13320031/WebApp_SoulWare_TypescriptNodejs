import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import hashPassword from "../../helpers/hashPassword.helper";
import AdminModel from "../../models/admin.model";
import AdminRoleModel from "../../models/adminRole.model";
import {
  TDataBodyCreateAdmin,
  TDataBodyUpdateAdmin,
} from "../../types/admin.type";
import { TPagination, TStatusFilter } from "../../types/index.type";

// [GET]: /admin/admin
const adminGet = async (req: Request, res: Response): Promise<void> => {
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
        { fullName: { $regex: keywordRegex } },
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

  // Handle singer filter
  let role: string = "all";
  if (req.query.role) role = req.query.role as string;

  if (role && role !== "all")
    find = {
      ...find,
      roleId: {
        _id: role,
      },
    };

  // Handle pagination
  let page: number = 1;
  let limit: number = APP_ADMIN_PAGINATION_LIMIT;
  let type: string = "";

  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit) limit = Number(req.query.limit);
  if (req.query.type) type = req.query.type as string;

  const count = await AdminModel.countDocuments(find);

  const pagination: TPagination = await handlePagination(
    page,
    limit,
    type,
    count,
  );

  const adminList = await AdminModel.find(find)
    .select("-deleted -deletedAt")
    .sort(sortFilter.sortOptions)
    .populate("roleId", "name")
    .skip(pagination.skipPage)
    .limit(pagination.limitPage);

  const adminRoleList = await AdminRoleModel.find({
    deleted: false,
    status: "active",
  }).select("name");

  res.render("admin/pages/admin/admin.view.ejs", {
    pageTitle: "Danh sách quản trị viên",
    pathname,
    adminList,
    pagination,
    keyword,
    status,
    statusFilter,
    sort: sortFilter.sort,
    adminRoleList,
    role,
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

    const existingAdmin = await AdminModel.findOne({
      email: req.body.email,
    });

    if (existingAdmin) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Email người dùng đã được đăng ký! ",
      });
      return;
    }

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

// [GET]: /admin/admins/update/:adminId
const getAAdminByIdGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let adminId: string = "";

    if (req.params.adminId) adminId = req.params.adminId as string;

    const admin = await AdminModel.findOne({
      _id: adminId,
      deleted: false,
    }).select("-deleted -deletedAt");
    const adminRoleList = await AdminRoleModel.find({
      deleted: false,
      status: "active",
    }).select("name");

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy quản trị viên!",
      });
      return;
    }

    res.render("admin/pages/admin/update.view.ejs", {
      pageTitle: "Cập nhật quản trị viên",
      pathname,
      admin,
      adminRoleList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - update admin",
    });
    return;
  }
};

// [PATCH]: /admin/admins/update/:adminId
const updateAAdminByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let adminId: string = "";
    let avatar: string = "";
    let password: string = "";

    if (req.params.adminId) adminId = req.params.adminId as string;

    const admin = await AdminModel.findOne({
      _id: adminId,
      deleted: false,
    });

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy quản trị viên!",
      });
      return;
    }

    if (req.body.avatar) avatar = req.body.avatar;
    if (req.body.password) password = await hashPassword(req.body.password);

    const dataBodyUpdateAdmin: TDataBodyUpdateAdmin = {
      email: req.body.email ? req.body.email : admin.email,
      password: password ? password : admin.password,
      phone: req.body.phone ? req.body.phone : admin.phone,
      avatar: avatar ? avatar : admin.avatar,
      fullName: req.body.fullName ? req.body.fullName : admin.fullName,
      birthday: req.body.birthday ? req.body.birthday : admin.birthday,
      address: req.body.address ? req.body.address : admin.address,
      description: req.body.description
        ? req.body.description
        : admin.description,
      status: req.body.status ? req.body.status : admin.status,
      position: req.body.position ? req.body.position : admin.position,
      roleId: req.body.roleId ? req.body.roleId : admin.roleId,
    };

    await AdminModel.updateOne({ _id: adminId }, dataBodyUpdateAdmin);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật quản trị viên thành công",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - update admin",
    });
    return;
  }
};

// [PATCH]: /admin/admins/soft-delete/:adminId
const softRemoveAdminByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let adminId: string = "";

    if (req.params.adminId) adminId = req.params.adminId as string;

    const admin = await AdminModel.findOne({
      _id: adminId,
      deleted: false,
    });

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy quản trị viên!",
      });
      return;
    }

    await AdminModel.updateOne({ _id: adminId }, { deleted: true });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xóa quản trị viên thành công",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - soft remove admin",
    });
    return;
  }
};

// [PATCH]: /admin/admins/change-status/:adminId/:status
const changeStatusAdminPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let adminId: string = "";
    let status: string = "";

    if (req.params.adminId) adminId = req.params.adminId as string;
    if (req.params.status) status = req.params.status as string;

    const admin = await AdminModel.findOne({
      _id: adminId,
      deleted: false,
    });

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy quản trị viên!",
      });
      return;
    }

    await AdminModel.updateOne({ _id: adminId }, { status: status });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật trạng thái quản trị viên thành công",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - change status admin",
    });
    return;
  }
};

// [PATCH]: /admin/admins/update-multi
const updateMultiAdminPatch = async (req: Request, res: Response) => {
  try {
    let ids: string[] = [];
    let type: string = "";

    if (req.body.ids) ids = req.body.ids as string[];
    if (req.body.type) type = req.body.type as string;

    if (!ids || !type || ids.length <= 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Tham số không hợp lệ",
      });
      return;
    }

    switch (type) {
      case "status-active":
        await AdminModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "active" },
        );
        break;
      case "status-inactive":
        await AdminModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "inactive" },
        );
        break;
      case "soft-deleted":
        await AdminModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { deleted: true },
        );
        break;
      case "hard-deleted":
        await AdminModel.deleteMany({ _id: { $in: ids } });
        break;
      default:
        break;
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật quản trị viên thành công",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - update multi admin",
    });
    return;
  }
};

type TAdminController = {
  adminGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminGet: (req: Request, res: Response) => Promise<void>;
  createANewAdminPost: (req: Request, res: Response) => Promise<void>;
  getAAdminByIdGet: (req: Request, res: Response) => Promise<void>;
  updateAAdminByIdPatch: (req: Request, res: Response) => Promise<void>;
  softRemoveAdminByIdPatch: (req: Request, res: Response) => Promise<void>;
  changeStatusAdminPatch: (req: Request, res: Response) => Promise<void>;
  updateMultiAdminPatch: (req: Request, res: Response) => Promise<void>;
};

export const adminController: TAdminController = {
  adminGet,
  createANewAdminGet,
  createANewAdminPost,
  getAAdminByIdGet,
  updateAAdminByIdPatch,
  softRemoveAdminByIdPatch,
  changeStatusAdminPatch,
  updateMultiAdminPatch,
};

export default adminController;
