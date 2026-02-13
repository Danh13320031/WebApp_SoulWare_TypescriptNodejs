import { Request, Response } from "express";
import FavoriteSongModel from "../../models/favoriteSong.model";

// [GET]: /favorite-songs/
const getAllFavoriteSongGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const favoriteSongList = await FavoriteSongModel.find({
    // userId: req.user?._id, // Khi có xác thực người dùng thì tìm bài hát thích của tôi
    status: "active",
    deleted: false,
  }).populate({
    path: "songId",
    select: "title avatar singerId slug like",
    populate: { path: "singerId", select: "stageName slug" },
  });

  res.render("client/pages/favoriteSong/favoriteSong.view.ejs", {
    pageTitle: "Playlist yêu thích của tôi",
    favoriteSongList,
  });
};

type IFavoriteSongController = {
  getAllFavoriteSongGet: (req: Request, res: Response) => Promise<void>;
};

const favoriteSongController: IFavoriteSongController = {
  getAllFavoriteSongGet,
};

export default favoriteSongController;
