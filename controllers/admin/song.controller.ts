import { Request, Response } from "express";
import { APP_PREFIX_ADMIN } from "../../constants/app.constant";
import SingerModel from "../../models/singer.model";
import SongModel from "../../models/song.model";
import TopicModel from "../../models/topic.model";
import { TDataBodyCreateSong } from "../../types/song.type";

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
    position: req.body.position ? Number(req.body.position) : countDocument + 1,
    status: req.body.status || "active",
    topicId: req.body.topicId || "",
    singerId: req.body.singerId || "",
  };

  const newSong = new SongModel(dataBodyCreateSong);
  await newSong.save();

  res.redirect(`${APP_PREFIX_ADMIN}/songs`);
};

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
  createANewSongGet: (req: Request, res: Response) => Promise<void>;
  createANewSongPost: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = {
  getAllSongGet,
  createANewSongGet,
  createANewSongPost,
};

export default songController;
