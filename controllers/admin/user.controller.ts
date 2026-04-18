import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import hashPassword from "../../helpers/hashPassword.helper";
import UserModel from "../../models/user.model";
import {
  TDataBodyCreateUser,
  TDataBodyUpdateUser,
} from "../../types/user.type";
// import UserRoleModel from "../../models/userRole.model";
import dayjs from "dayjs";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import SubscriptionPlanModel from "../../models/subscriptionPlan.model";
import { TPagination, TStatusFilter } from "../../types/index.type";

// [GET]: /admin/users
const getAllUserGet = async (req: Request, res: Response): Promise<void> => {
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
    let subscriptionPlan: string = "all";
    if (req.query.subscriptionPlan)
      subscriptionPlan = req.query.subscriptionPlan as string;

    if (subscriptionPlan && subscriptionPlan !== "all")
      find = {
        ...find,
        subscriptionPlanId: {
          _id: subscriptionPlan,
        },
      };

    // Handle pagination
    let page: number = 1;
    let limit: number = APP_ADMIN_PAGINATION_LIMIT;
    let type: string = "";

    if (req.query.page) page = Number(req.query.page);
    if (req.query.limit) limit = Number(req.query.limit);
    if (req.query.type) type = req.query.type as string;

    const count = await UserModel.countDocuments(find);

    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    const userList = await UserModel.find(find)
      .select("fullName email phone avatar status position subscriptionPlanId")
      .populate("subscriptionPlanId", "name code")
      .sort(sortFilter.sortOptions);

    const subscriptionPlanList = await SubscriptionPlanModel.find({
      deleted: false,
      status: "active",
    }).select("name");

    res.render("admin/pages/user/user.view.ejs", {
      pageTitle: "Quản lý người dùng",
      pathname,
      userList,
      keyword,
      status,
      statusFilter,
      sort: sortFilter.sort,
      subscriptionPlanList,
      subscriptionPlan,
      pagination,
    });
    return;
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
    let find: any = { deleted: false };

    const subscriptionPlanList =
      await SubscriptionPlanModel.find(find).select("name code");

    res.render("admin/pages/user/create.view.ejs", {
      pageTitle: "Tạo mới người dùng",
      pathname,
      subscriptionPlanList,
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

    const subscriptionPlan = await SubscriptionPlanModel.findOne({
      _id: req.body.subscriptionPlanId,
    });

    if (!subscriptionPlan) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Không tìm thấy gói người dùng!",
      });
      return;
    }

    let subscriptionStartAt: Date | null = null;
    let subscriptionEndAt: Date | null = null;

    if (subscriptionPlan.code !== "FREE") {
      subscriptionStartAt = dayjs(Date.now()).toDate();
      subscriptionEndAt = dayjs(subscriptionStartAt).add(1, "month").toDate();
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
      subscriptionPlanId: subscriptionPlan._id.toString(),
      subscriptionStartAt: subscriptionStartAt ? subscriptionStartAt : null,
      subscriptionEndAt: subscriptionEndAt ? subscriptionEndAt : null,
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

// [GET]: /admin/users/update/:userId
const getAUserByIdGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let userId: string = "";

    if (req.params.userId) userId = req.params.userId as string;

    const user = await UserModel.findOne({
      _id: userId,
      deleted: false,
    }).select("-deleted -deletedAt");
    const subscriptionPlanList = await SubscriptionPlanModel.find({
      deleted: false,
      status: "active",
    }).select("name code");

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy người dùng!",
      });
      return;
    }

    res.render("admin/pages/user/update.view.ejs", {
      pageTitle: "Cập nhật người dùng",
      pathname,
      user,
      subscriptionPlanList,
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

// [PATCH]: /admin/users/update/:adminId
const updateAUserByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let userId: string = "";
    let avatar: string = "";
    let password: string = "";

    if (req.params.userId) userId = req.params.userId as string;

    const admin = await UserModel.findOne({
      _id: userId,
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

    const subscriptionPlan = await SubscriptionPlanModel.findOne({
      _id: req.body.subscriptionPlanId,
    });

    if (!subscriptionPlan) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        status: "Fail",
        message: "Không tìm thấy gói người dùng!",
      });
      return;
    }

    let subscriptionStartAt: Date | null = admin.subscriptionStartAt;
    let subscriptionEndAt: Date | null = admin.subscriptionEndAt;

    if (
      subscriptionPlan.code !== "FREE" &&
      subscriptionPlan._id.toString() !==
        admin.subscriptionPlanId._id.toString()
    ) {
      subscriptionStartAt = dayjs(Date.now()).toDate();
      subscriptionEndAt = dayjs(subscriptionStartAt).add(1, "month").toDate();
    }

    if (subscriptionPlan.code === "FREE") {
      subscriptionStartAt = null;
      subscriptionEndAt = null;
    }

    const dataBodyUpdateUser: TDataBodyUpdateUser = {
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
      subscriptionPlanId: subscriptionPlan._id.toString(),
      subscriptionStartAt: subscriptionStartAt,
      subscriptionEndAt: subscriptionEndAt,
    };

    await UserModel.updateOne({ _id: userId }, dataBodyUpdateUser);

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

type IUserController = {
  getAllUserGet: (req: Request, res: Response) => Promise<void>;
  createANewUserGet: (req: Request, res: Response) => Promise<void>;
  createANewUserPost: (req: Request, res: Response) => Promise<void>;
  getAUserByIdGet: (req: Request, res: Response) => Promise<void>;
  updateAUserByIdPatch: (req: Request, res: Response) => Promise<void>;
};

const userController: IUserController = {
  getAllUserGet,
  createANewUserGet,
  createANewUserPost,
  getAUserByIdGet,
  updateAUserByIdPatch,
};

export default userController;
