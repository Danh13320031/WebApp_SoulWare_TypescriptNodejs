import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import SingerModel from "../../models/singer.model";
import { TPagination, TStatusFilter } from "../../types/index.type";
import {
  TDataBodyCreateSinger,
  TDataBodyUpdateSinger,
} from "../../types/signer.type";

// [GET]: /admin/singers
const getAllSingerGet = async (req: Request, res: Response): Promise<void> => {
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

    // Handle pagination
    let page: number = 1;
    let limit: number = APP_ADMIN_PAGINATION_LIMIT;
    let type: string = "";

    if (req.query.page) page = Number(req.query.page);
    if (req.query.limit) limit = Number(req.query.limit);
    if (req.query.type) type = req.query.type as string;

    const count = await SingerModel.countDocuments(find);

    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    const singerList = await SingerModel.find(find)
      .select("-deleted -deletedAt -createdAt -updatedAt -slug -__v")
      .sort(sortFilter.sortOptions)
      .skip(pagination.skipPage)
      .limit(pagination.limitPage);

    res.render("admin/pages/singer/singer.view.ejs", {
      pageTitle: "Danh sách ca sĩ",
      pathname,
      singerList,
      pagination,
      keyword,
      status,
      statusFilter,
      sort: sortFilter.sort,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getAllSinger",
    });
    return;
  }
};

// [GET]: /admin/singers/create
const createANewSingerGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/singer/create.view.ejs", {
      pageTitle: "Tạo mới ca sĩ",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSinger",
    });
    return;
  }
};

// [POST]: /admin/singers/create
const createANewSingerPost = async (req: Request, res: Response) => {
  try {
    const countDocument = await SingerModel.countDocuments();
    let avatar: string = "";
    let fullName: string = "";

    if (req.body.avatar) avatar = req.body.avatar;
    if (req.body.name) fullName = req.body.name;

    const dataBodyCreateSinger: TDataBodyCreateSinger = {
      avatar: avatar ? avatar : "",
      fullName: fullName ? fullName : "",
      stageName: req.body.stageName ? req.body.stageName : "",
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : "active",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
    };

    const newSinger = new SingerModel(dataBodyCreateSinger);
    await newSinger.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSinger",
    });
    return;
  }
};

// [GET]: /admin/singers/update/:singerId
const getASingerByIdGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let singerId: string = "";

    if (req.params.singerId) singerId = req.params.singerId as string;

    const singer = await SingerModel.findOne({
      _id: singerId,
      deleted: false,
    }).select("-deleted -deletedAt -createdAt -updatedAt -slug -__v");

    if (!singer) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy ca sĩ",
      });
      return;
    }

    res.render("admin/pages/singer/update.view.ejs", {
      pageTitle: "Cập nhật ca sĩ",
      pathname,
      singer,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getASingerById",
    });
    return;
  }
};

// [PATCH]: /admin/singers/update/:singerId
const updateASingerByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let singerId: string = "";
    let avatar: string = "";
    let fullName: string = "";

    if (req.params.singerId) singerId = req.params.singerId as string;
    if (req.body.name) fullName = req.body.name;
    if (req.body.avatar) avatar = req.body.avatar;

    const singer = await SingerModel.findOne({
      _id: singerId,
      deleted: false,
    });

    if (!singer) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy ca sĩ",
      });
      return;
    }

    const dataBodyUpdateSinger: TDataBodyUpdateSinger = {
      fullName: fullName ? fullName : singer.fullName,
      stageName: req.body.stageName ? req.body.stageName : singer.stageName,
      avatar: avatar ? avatar : singer.avatar,
      description: req.body.description
        ? req.body.description
        : singer.description,
      status: req.body.status ? req.body.status : singer.status,
      position: req.body.position ? Number(req.body.position) : singer.position,
    };

    await SingerModel.updateOne({ _id: singerId }, dataBodyUpdateSinger);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - updateASingerById",
    });
    return;
  }
};

// [PATCH]: /admin/singers/soft-delete/:singerId
const softRemoveASingerByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let singerId: string = "";

    if (req.params.singerId) singerId = req.params.singerId as string;

    const singer = await SingerModel.findOne({
      _id: singerId,
      deleted: false,
    });

    if (!singer) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy ca sĩ!",
      });
      return;
    }

    await SingerModel.updateOne({ _id: singerId }, { deleted: true });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xóa ca sĩ thành công",
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

// [PATCH]: /admin/admins/change-status/:singerId/:status
const changeStatusSingerPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let singerId: string = "";
    let status: string = "";

    if (req.params.singerId) singerId = req.params.singerId as string;
    if (req.params.status) status = req.params.status as string;

    const admin = await SingerModel.findOne({
      _id: singerId,
      deleted: false,
    });

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy ca sĩ!",
      });
      return;
    }

    await SingerModel.updateOne({ _id: singerId }, { status: status });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật trạng thái ca sĩ thành công",
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

type TSingerController = {
  getAllSingerGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerPost: (req: Request, res: Response) => Promise<void>;
  getASingerByIdGet: (req: Request, res: Response) => Promise<void>;
  updateASingerByIdPatch: (req: Request, res: Response) => Promise<void>;
  softRemoveASingerByIdPatch: (req: Request, res: Response) => Promise<void>;
  changeStatusSingerPatch: (req: Request, res: Response) => Promise<void>;
};

const singerController: TSingerController = {
  getAllSingerGet,
  createANewSingerGet,
  createANewSingerPost,
  getASingerByIdGet,
  updateASingerByIdPatch,
  softRemoveASingerByIdPatch,
  changeStatusSingerPatch,
};

export default singerController;
