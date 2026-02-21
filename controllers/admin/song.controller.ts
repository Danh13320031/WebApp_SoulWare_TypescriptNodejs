import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import SingerModel from "../../models/singer.model";
import SongModel from "../../models/song.model";
import TopicModel from "../../models/topic.model";
import {
  TDataBodyCreateSong,
  TDataBodyUpdateSong,
} from "../../types/song.type";

// [GET]: /admin/songs
const getAllSongGet = async (req: Request, res: Response): Promise<void> => {
  const songList = await SongModel.find({
    deleted: false,
  })
    .select("-deleted -description -audio -lyrics -slug")
    .sort({ position: "desc" })
    .populate("singerId", "stageName")
    .populate("topicId", "title");

  res.render("admin/pages/song/song.view.ejs", {
    pageTitle: "Danh sách bài hát",
    songList,
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
};

const songController: TSongController = {
  getAllSongGet,
  createANewSongGet,
  createANewSongPost,
  getASongByIdGet,
  updateASongByIdPatch,
};

export default songController;
