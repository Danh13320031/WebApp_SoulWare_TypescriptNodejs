import { Request, Response } from "express";

// [GET]: /songs/:topicSlug
const getAllSongGet = async (req: Request, res: Response): Promise<void> => {
  console.log(req.params.topicSlug);

  res.render("client/pages/song/song.view.ejs", {
    pageTitle: `Danh sách nhạc Pop`,
  });
};

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = { getAllSongGet };

export default songController;
