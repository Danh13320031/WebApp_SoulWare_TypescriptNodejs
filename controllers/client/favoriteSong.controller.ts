import { Request, Response } from "express";

// [GET]: /favoritesongs/
const getAllFavoriteSongGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.render("client/pages/favoriteSong/favoriteSong.view.ejs", {
    pageTitle: "Danh sách bài hát yêu thích",
  });
};

type IFavoriteSongController = {
  getAllFavoriteSongGet: (req: Request, res: Response) => Promise<void>;
};

const favoriteSongController: IFavoriteSongController = {
  getAllFavoriteSongGet,
};

export default favoriteSongController;
