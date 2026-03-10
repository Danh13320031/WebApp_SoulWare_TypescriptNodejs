import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import TopicModel from "../../models/topic.model";
import { TPagination, TStatusFilter } from "../../types/index.type";
import {
  TDataBodyCreateTopic,
  TDataBodyUpdateTopic,
} from "../../types/topic.type";

// [GET]: /admin/topics
const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  let find: any = { deleted: false };

  // Handle pagination
  let page: number = 1;
  let limit: number = APP_ADMIN_PAGINATION_LIMIT;
  let type: string = "";

  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit)
    limit = Number(req.query.limit) || APP_ADMIN_PAGINATION_LIMIT;
  if (req.query.type) type = req.query.type as string;

  const count = await TopicModel.countDocuments(find);
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
        { title: { $regex: keywordRegex } },
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

  const topicList = await TopicModel.find(find)
    .select("-deleted -description")
    .sort(sortFilter.sortOptions)
    .skip(pagination.skipPage)
    .limit(pagination.limitPage);

  res.render("admin/pages/topic/topic.view.ejs", {
    pageTitle: "Danh sách chủ đề",
    topicList,
    pagination,
    keyword,
    status,
    statusFilter,
    sort: sortFilter.sort,
  });
};

// [GET]: /admin/topics/create
const createANewTopicGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.render("admin/pages/topic/create.view.ejs", {
    pageTitle: "Thêm mới chủ đề",
  });
};

// [POST]: /admin/songs/create
const createANewTopicPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await TopicModel.countDocuments();
    let avatar: string = "";

    if (req.body.avatar) avatar = req.body.avatar;

    const dataBodyCreateTopic: TDataBodyCreateTopic = {
      title: req.body.title ? req.body.title : "",
      avatar: avatar,
      description: req.body.description || "",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      status: req.body.status || "active",
    };

    const newSong = new TopicModel(dataBodyCreateTopic);
    await newSong.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo chủ đề thành công!",
    });
    return;
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

// [GET]: /admin/topics/update/:topicId
const getATopicByIdGet = async (req: Request, res: Response): Promise<void> => {
  try {
    let topicId: string = "";

    if (req.params.topicId) topicId = req.params.topicId as string;

    const topic = await TopicModel.findOne({
      _id: topicId,
      deleted: false,
    }).select("-deleted -deletedAt -createdAt -updatedAt -slug -__v");

    if (!topic) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy chủ đề",
      });
      return;
    }

    res.render("admin/pages/topic/update.view.ejs", {
      pageTitle: `Chỉnh sửa chủ đề ${topic.title}`,
      topic,
    });
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

// [PATCH]: /admin/topics/update/:topicId
const updateATopicByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const topicId: string = req.params.topicId as string;

    const topic = await TopicModel.findOne({
      _id: topicId,
      deleted: false,
    });

    if (!topic) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy chủ đề",
      });
      return;
    }

    if (req.body.avatar) topic.avatar = req.body.avatar;

    const dataBodyupdateTopic: TDataBodyUpdateTopic = {
      title: req.body.title ? req.body.title : topic.title,
      avatar: req.body.avatar ? req.body.avatar : topic.avatar,
      description: req.body.description
        ? req.body.description
        : topic.description,
      position: req.body.position ? Number(req.body.position) : topic.position,
      status: req.body.status ? req.body.status : topic.status,
    };

    await TopicModel.updateOne({ _id: topicId }, dataBodyupdateTopic);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật chủ đề thành công!",
    });
    return;
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

// [PATCH]: /admin/topics/soft-delete/topicId
const softRemoveTopicByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const topicId: string = req.params.topicId as string;

    const topic = await TopicModel.findOne({
      _id: topicId,
      deleted: false,
    });

    if (!topic) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy chủ đề",
      });
      return;
    }

    await TopicModel.updateOne({ _id: topicId }, { deleted: true });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xóa chủ đề thành công",
    });
    return;
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

// [PATCH]: /admin/topics/change-status/:topicId/:status
const changeStatusTopicPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const topicId = req.params.topicId as string;
    const topicStatus = req.params.status as string;

    const topic = await TopicModel.findOne({
      _id: topicId,
      deleted: false,
    });

    if (!topic) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy chủ đề",
      });
      return;
    }

    await TopicModel.findOneAndUpdate(
      { _id: topicId },
      { status: topicStatus },
    ).select("_id");

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật trạng thái chủ đề thành công!",
    });
    return;
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

type TTopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
  createANewTopicGet: (req: Request, res: Response) => Promise<void>;
  createANewTopicPost: (req: Request, res: Response) => Promise<void>;
  getATopicByIdGet: (req: Request, res: Response) => Promise<void>;
  updateATopicByIdPatch: (req: Request, res: Response) => Promise<void>;
  softRemoveTopicByIdPatch: (req: Request, res: Response) => Promise<void>;
  changeStatusTopicPatch: (req: Request, res: Response) => Promise<void>;
};

export const topicController: TTopicController = {
  getAllTopicGet,
  createANewTopicGet,
  createANewTopicPost,
  getATopicByIdGet,
  updateATopicByIdPatch,
  softRemoveTopicByIdPatch,
  changeStatusTopicPatch,
};

export default topicController;
