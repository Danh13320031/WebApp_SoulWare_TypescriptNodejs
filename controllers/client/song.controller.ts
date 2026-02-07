import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
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

  res.render("client/pages/song/detail.view.ejs", {
    pageTitle: `Bài hát ${song?.title}`,
    song,
  });
};

// [PATCH]: /songs/like/:type/:songId
const likeSongGet = async (req: Request, res: Response): Promise<void> => {
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
    success: "Success",
    message: "Thích bài hát thành công",
    data: data,
  });
  return;
};

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
  getOneSongGet: (req: Request, res: Response) => Promise<void>;
  likeSongGet: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = {
  getAllSongGet,
  getOneSongGet,
  likeSongGet,
};

export default songController;
