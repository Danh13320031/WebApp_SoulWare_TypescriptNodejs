import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import FavoriteSongModel from "../../models/favoriteSong.model";
import SongModel from "../../models/song.model";
import TopicModel from "../../models/topic.model";

// [GET]: /songs/:topicSlug
const getAllSongGet = async (req: Request, res: Response): Promise<void> => {
  const topicSlug: string = req.params.topicSlug as string;
  const topic = await TopicModel.findOne({
    slug: topicSlug,
    status: "active",
    deleted: false,
  });
  const topicTitle: string = topic?.title as string;

  const songList = await SongModel.find({
    topicId: topic?._id,
    status: "active",
    deleted: false,
  })
    .select("title avatar singerId slug like")
    .populate("singerId", "stageName slug");

  res.render("client/pages/song/song.view.ejs", {
    pageTitle: `Danh sách nhạc ${topicTitle}`,
    songList,
    keyword: "",
  });
};

// [GET]: /songs/detail/:songSlug
const getOneSongGet = async (req: Request, res: Response): Promise<void> => {
  const songSlug: string = req.params.songSlug as string;

  const song = await SongModel.findOne({
    slug: songSlug,
    status: "active",
    deleted: false,
  })
    .select("-deletedAt -deleted -status -position -__v")
    .populate("singerId", "stageName slug")
    .populate("topicId", "title slug");

  const favoritedSong = await FavoriteSongModel.findOne({
    songId: song?._id,
  });

  res.render("client/pages/song/detail.view.ejs", {
    pageTitle: `Bài hát ${song?.title}`,
    song,
    favorited: favoritedSong ? true : false,
    keyword: "",
  });
};

// [PATCH]: /songs/like/:type/:songId
const likeSongPatch = async (req: Request, res: Response): Promise<void> => {
  const songId: string = req.params.songId as string;
  const type: string = req.params.type as string;

  const song = await SongModel.findOne({
    _id: songId,
    status: "active",
    deleted: false,
  });

  if (!song) {
    res.json({
      code: StatusCodes.NOT_FOUND,
      status: "Fail",
      message: "Không tìm thấy bài hát",
    });
    return;
  }

  if (type === "yes") song.like += 1;
  else if (type === "no") song.like -= 1;
  await song.save();

  const data = {
    like: song.like,
  };

  res.json({
    code: StatusCodes.OK,
    status: "Success",
    message: "Thích bài hát thành công",
    data: data,
  });
  return;
};

// [PATCH]: /songs/favorite/:type/:songId
const favoriteSongPatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const songId: string = req.params.songId as string;
  const type: string = req.params.type as string;

  switch (type) {
    case "yes":
      const favoriteSong = await FavoriteSongModel.findOne({
        songId: songId,
        status: "active",
        deleted: false,
      }).select("songId");

      if (!favoriteSong) await FavoriteSongModel.create({ songId: songId });

      res.json({
        code: StatusCodes.OK,
        status: "Success",
        message: "Yêu thích bài hát thành công",
      });

      break;
    case "no":
      await FavoriteSongModel.deleteOne({ songId: songId });

      res.json({
        code: StatusCodes.OK,
        status: "Success",
        message: "Bỏ yêu thích bài hát thành công",
      });

      break;
    default:
      break;
  }
};

// [PATCH]: /songs/listen/:songId
const listenToSongOncePatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const songId: string = req.params.songId as string;

  const song = await SongModel.findOne({
    _id: songId,
    status: "active",
    deleted: false,
  });

  if (!song) {
    res.json({
      code: StatusCodes.NOT_FOUND,
      status: "Fail",
      message: "Không tìm thấy bài hát",
    });
    return;
  }

  song.listen += 1;
  await song.save();

  res.json({
    code: StatusCodes.OK,
    status: "Success",
    message: "Nghe bài hát thành công",
    data: {
      listen: song.listen,
    },
  });
  return;
};

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
  getOneSongGet: (req: Request, res: Response) => Promise<void>;
  likeSongPatch: (req: Request, res: Response) => Promise<void>;
  favoriteSongPatch: (req: Request, res: Response) => Promise<void>;
  listenToSongOncePatch: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = {
  getAllSongGet,
  getOneSongGet,
  likeSongPatch,
  favoriteSongPatch,
  listenToSongOncePatch,
};

export default songController;
