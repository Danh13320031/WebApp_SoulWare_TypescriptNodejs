import { Request, Response } from "express";
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

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = { getAllSongGet };

export default songController;
