import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import SingerModel from "../../models/singer.model";
import SingerGroupModel from "../../models/singerGroup.model";
import { TPagination, TStatusFilter } from "../../types/index.type";
import {
  TDataBodyCreateSingerGroup,
  TDataBodyUpdateSingerGroup,
} from "../../types/singerGroup.type";

// [GET]: /admin/singer-groups
const singerGroupGet = async (req: Request, res: Response): Promise<void> => {
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

    const count = await SingerGroupModel.countDocuments(find);

    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    const singerGroupList = await SingerGroupModel.find(find)
      .select("-deleted -createdAt -deletedAt -updatedAt -slug -__v")
      .sort(sortFilter.sortOptions)
      .populate("singers", "fullName stageName")
      .skip(pagination.skipPage)
      .limit(pagination.limitPage);

    res.render("admin/pages/singerGroup/singerGroup.view.ejs", {
      pageTitle: "Danh sách nhóm ca sĩ",
      pathname,
      pagination,
      singerGroupList,
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
      message: "Server error - singerGroupGet",
    });
    return;
  }
};

// [GET]: /admin/singer-groups/create
const createANewSingerGroupGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    const singerList = await SingerModel.find(find).select("stageName");

    res.render("admin/pages/singerGroup/create.view.ejs", {
      pageTitle: "Tạo mới nhóm ca sĩ",
      pathname,
      singerList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSingerGroupGet",
    });
    return;
  }
};

// [POST]: /admin/singer-groups/create
const createANewSingerGroupPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument: number = await SingerGroupModel.countDocuments();
    let avatar: string = "";

    if (req.body.avatar) avatar = req.body.avatar;

    const dataBodyCreateSingerGroup: TDataBodyCreateSingerGroup = {
      avatar: avatar ? avatar : "",
      name: req.body.name ? req.body.name : "",
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : "active",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      singers: req.body.singers ? req.body.singers : [],
    };

    const newSingerGroup = new SingerGroupModel(dataBodyCreateSingerGroup);
    await newSingerGroup.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới nhóm ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSingerGroupPost",
    });
    return;
  }
};

// [GET]: /admin/singer-groups/update/:singerGroupId
const getASingerGroupByIdGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };
    let singerGroupId: string = "";

    if (req.params.singerGroupId)
      singerGroupId = req.params.singerGroupId as string;

    const singerGroup = await SingerGroupModel.findOne({
      _id: singerGroupId,
      ...find,
    })
      .select("-deleted -deletedAt -createdAt -updatedAt -slug -__v")
      .populate("singers", "stageName");

    if (!singerGroup) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy nhóm ca sĩ",
      });
      return;
    }

    const singerList = await SingerModel.find(find).select("stageName");

    const newSingerFromGroup = singerGroup.singers.map((singer) =>
      singer._id.toString(),
    );
    const newSingerList = singerList.map((singer) => {
      if (newSingerFromGroup.includes(singer._id.toString())) {
        return {
          ...singer,
          checked: true,
        };
      } else {
        return {
          ...singer,
          checked: false,
        };
      }
    });

    res.render("admin/pages/singerGroup/update.view.ejs", {
      pageTitle: "Cập nhật nhóm ca sĩ",
      singerGroup,
      pathname,
      newSingerList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getASingerGroupByIdGet",
    });
    return;
  }
};

// [PATCH]: /admin/singer-groups/update/:singerGroupId
const updateASingerGroupByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let singerGroupId: string = "";
    let avatar: string = "";

    if (req.params.singerGroupId)
      singerGroupId = req.params.singerGroupId as string;
    if (req.body.avatar) avatar = req.body.avatar;

    const singerGroup = await SingerGroupModel.findOne({
      _id: singerGroupId,
      deleted: false,
    });

    if (!singerGroup) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy nhóm ca sĩ",
      });
      return;
    }

    const dataBodyUpdateSingerGroup: TDataBodyUpdateSingerGroup = {
      avatar: avatar ? avatar : singerGroup.avatar,
      name: req.body.name ? req.body.name : null,
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : null,
      singers: req.body.singers ? req.body.singers : null,
    };

    await SingerGroupModel.updateOne(
      { _id: singerGroupId },
      { $set: dataBodyUpdateSingerGroup },
    );

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật nhóm ca sĩ thành cong!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - updateASingerGroupByIdPatch",
    });
    return;
  }
};

// [PATCH]: /admin/singer-groups/soft-delete/:singerGroupId
const softRemoveASingerGroupByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let singerGroupId: string = "";

    if (req.params.singerGroupId)
      singerGroupId = req.params.singerGroupId as string;

    const singerGroup = await SingerGroupModel.findOne({
      _id: singerGroupId,
      deleted: false,
    });

    if (!singerGroup) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy nhóm ca sĩ",
      });
      return;
    }

    await SingerGroupModel.updateOne({ _id: singerGroupId }, { deleted: true });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xóa nhóm ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - softDeleteASingerGroupByIdPatch",
    });
    return;
  }
};

// [PATCH]: /admin/singer-groups/change-status/:singerId/:status
const changeStatusSingerGroupPatch = async (req: Request, res: Response) => {
  try {
    let singerGroupId: string = "";
    let status: string = "";

    if (req.params.singerGroupId)
      singerGroupId = req.params.singerGroupId as string;
    if (req.params.status) status = req.params.status as string;

    const singerGroup = await SingerGroupModel.findOne({
      _id: singerGroupId,
      deleted: false,
    });

    if (!singerGroup) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy nhóm ca sĩ",
      });
      return;
    }

    await SingerGroupModel.updateOne(
      { _id: singerGroupId },
      { status: status },
    );

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật trạng thái thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - changeStatusSingerGroupPatch",
    });
    return;
  }
};

type TSingerGroupController = {
  singerGroupGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGroupGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGroupPost: (req: Request, res: Response) => Promise<void>;
  getASingerGroupByIdGet: (req: Request, res: Response) => Promise<void>;
  updateASingerGroupByIdPatch: (req: Request, res: Response) => Promise<void>;
  softRemoveASingerGroupByIdPatch: (
    req: Request,
    res: Response,
  ) => Promise<void>;
  changeStatusSingerGroupPatch: (
    req: Request,
    res: Response,
  ) => Promise<void>;
};

const singerGroupController: TSingerGroupController = {
  singerGroupGet,
  createANewSingerGroupGet,
  createANewSingerGroupPost,
  getASingerGroupByIdGet,
  updateASingerGroupByIdPatch,
  softRemoveASingerGroupByIdPatch,
  changeStatusSingerGroupPatch,
};

export default singerGroupController;
