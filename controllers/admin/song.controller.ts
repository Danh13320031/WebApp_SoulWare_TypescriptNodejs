import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import handleSortFilter from "../../helpers/admin/handleSortFilter.helper";
import handleStatusFilter from "../../helpers/admin/handleStatusFilter.helper";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import SingerModel from "../../models/singer.model";
import SongModel from "../../models/song.model";
import TopicModel from "../../models/topic.model";
import { TPagination, TStatusFilter } from "../../types/index.type";
import {
  TDataBodyCreateSong,
  TDataBodyUpdateSong,
} from "../../types/song.type";

// [GET]: /admin/songs
const getAllSongGet = async (req: Request, res: Response): Promise<void> => {
  let find: any = { deleted: false };

  // Handle pagination
  let page: number = 1;
  let limit: number = APP_ADMIN_PAGINATION_LIMIT;
  let type: string = "";

  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit) limit = Number(req.query.limit);
  if (req.query.type) type = req.query.type as string;

  const count = await SongModel.countDocuments(find);

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

  // Handle singer filter
  let singer: string = "all";
  if (req.query.singer) singer = req.query.singer as string;

  if (singer && singer !== "all")
    find = {
      ...find,
      singerId: {
        _id: singer,
      },
    };

  // Handle topic filter
  let topic: string = "all";
  if (req.query.topic) topic = req.query.topic as string;

  if (topic && topic !== "all")
    find = {
      ...find,
      topicId: {
        _id: topic,
      },
    };

  // Handle sort filter
  let sort: string = "";
  if (req.query.sort) sort = req.query.sort as string;

  const sortFilter = handleSortFilter(sort);

  const songList = await SongModel.find(find)
    .select("-deleted -description -audio -lyrics -slug")
    .sort(sortFilter.sortOptions)
    .populate("singerId", "stageName")
    .populate("topicId", "title")
    .skip(pagination.skipPage)
    .limit(pagination.limitPage);

  const singerList = await SingerModel.find({
    deleted: false,
  }).select("stageName");

  const topicList = await TopicModel.find({
    deleted: false,
  }).select("title");

  res.render("admin/pages/song/song.view.ejs", {
    pageTitle: "Danh sách bài hát",
    songList,
    pagination,
    keyword,
    status,
    statusFilter,
    singerList,
    singer,
    topicList,
    topic,
    sort: sortFilter.sort,
  });
};

// [GET]: /admin/songs/create
const createANewSongGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const singerList = await SingerModel.find({
    deleted: false,
  }).select("stageName");

  const topicList = await TopicModel.find({
    deleted: false,
  }).select("title");

  res.render("admin/pages/song/create.view.ejs", {
    pageTitle: "Thêm mới bài hát",
    singerList,
    topicList,
  });
};

// [POST]: /admin/songs/create
const createANewSongPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await SongModel.countDocuments();
    let avatar: string = "";
    let audio: string = "";

    if (req.body.avatar) avatar = req.body.avatar[0];
    if (req.body.audio) audio = req.body.audio[0];

    const dataBodyCreateSong: TDataBodyCreateSong = {
      title: req.body.title ? req.body.title : "",
      avatar: avatar,
      description: req.body.description || "",
      lyrics: req.body.lyrics || "",
      audio: audio,
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      status: req.body.status || "active",
      topicId: req.body.topicId || "",
      singerId: req.body.singerId || "",
    };

    const newSong = new SongModel(dataBodyCreateSong);
    await newSong.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo bài hát thành công!",
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

// [GET]: /admin/songs/update/:songId
const getASongByIdGet = async (req: Request, res: Response): Promise<void> => {
  try {
    let songId: string = "";

    if (req.params.songId) songId = req.params.songId as string;

    const song = await SongModel.findOne({
      _id: songId,
      deleted: false,
    })
      .select(
        "-deleted -deletedAt -createdAt -updatedAt -slug -like -listen -__v",
      )
      .populate("singerId", "stageName")
      .populate("topicId", "title");

    const singerList = await SingerModel.find({
      deleted: false,
    }).select("stageName");

    const topicList = await TopicModel.find({
      deleted: false,
    }).select("title");

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy bài hát",
      });
      return;
    }

    res.render("admin/pages/song/update.view.ejs", {
      pageTitle: `Chỉnh sửa bài hát ${song.title}`,
      song,
      singerList,
      topicList,
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

// [PATCH]: /admin/songs/update/:songId
const updateASongByIdPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const songId: string = req.params.songId as string;

    const song = await SongModel.findOne({
      _id: songId,
      deleted: false,
    });

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy bài hát",
      });
      return;
    }

    if (req.body.avatar) song.avatar = req.body.avatar[0];
    if (req.body.audio) song.audio = req.body.audio[0];

    const dataBodyUpdateSong: TDataBodyUpdateSong = {
      title: req.body.title ? req.body.title : song.title,
      avatar: req.body.avatar ? req.body.avatar[0] : song.avatar,
      description: req.body.description
        ? req.body.description
        : song.description,
      lyrics: req.body.lyrics ? req.body.lyrics : song.lyrics,
      audio: req.body.audio ? req.body.audio[0] : song.audio,
      position: req.body.position ? Number(req.body.position) : song.position,
      status: req.body.status ? req.body.status : song.status,
      topicId: req.body.topicId ? req.body.topicId : song.topicId,
      singerId: req.body.singerId ? req.body.singerId : song.singerId,
    };

    await SongModel.updateOne({ _id: songId }, dataBodyUpdateSong);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật bài hát thành công",
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

// [DELETE]: /admin/songs/soft-delete/:songId
const softRemoveASongByIdDelete = async (req: Request, res: Response) => {
  try {
    const songId: string = req.params.songId as string;

    const song = await SongModel.findOne({
      _id: songId,
      deleted: false,
    });

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy bài hát",
      });
      return;
    }

    await SongModel.updateOne({ _id: songId }, { deleted: true });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Xoa bài hát thành công",
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

// [PATCH]: /admin/songs/change-status/:songId/:status
const changeStatusSongPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const songId = req.params.songId as string;
    const songStatus = req.params.status as string;

    const song = await SongModel.findOne({
      _id: songId,
      deleted: false,
    });

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        status: "Fail",
        message: "Không tìm thấy bài hát",
      });
      return;
    }

    await SongModel.findOneAndUpdate(
      { _id: songId },
      {
        status: songStatus,
      },
    ).select("_id");

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Đổi trạng thái thành công!",
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

// [PATCH]: /admin/songs/update-multi
const updateMultiSongPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
      case "status-active": {
        await SongModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "active" },
        );
        break;
      }
      case "status-inactive": {
        await SongModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "inactive" },
        );
        break;
      }
      case "soft-delete": {
        await SongModel.updateMany(
          { _id: { $in: ids }, deleted: false },
          { deleted: true },
        );
        break;
      }
      case "hard-delete": {
        await SongModel.deleteMany({ _id: { $in: ids } });
        break;
      }
      default: {
        break;
      }
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Cập nhật bài hát thành công",
      data: ids,
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

type TSongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
  createANewSongGet: (req: Request, res: Response) => Promise<void>;
  createANewSongPost: (req: Request, res: Response) => Promise<void>;
  getASongByIdGet: (req: Request, res: Response) => Promise<void>;
  updateASongByIdPatch: (req: Request, res: Response) => Promise<void>;
  softRemoveASongByIdDelete: (req: Request, res: Response) => Promise<void>;
  changeStatusSongPatch: (req: Request, res: Response) => Promise<void>;
  updateMultiSongPatch: (req: Request, res: Response) => Promise<void>;
};

const songController: TSongController = {
  getAllSongGet,
  createANewSongGet,
  createANewSongPost,
  getASongByIdGet,
  updateASongByIdPatch,
  softRemoveASongByIdDelete,
  changeStatusSongPatch,
  updateMultiSongPatch,
};

export default songController;
