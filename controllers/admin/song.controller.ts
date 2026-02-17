import { Request, Response } from "express";

const getAllSongGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/song/song.view.ejs", {
    pageTitle: "Danh sách bài hát",
  });
};

type ISongController = {
  getAllSongGet: (req: Request, res: Response) => Promise<void>;
};

const songController: ISongController = {
  getAllSongGet,
};

export default songController;
