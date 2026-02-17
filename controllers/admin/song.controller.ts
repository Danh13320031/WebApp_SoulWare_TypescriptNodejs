import { Request, Response } from "express";
import SongModel from "../../models/song.model";

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

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = {
  getAllSongGet,
};

export default songController;
