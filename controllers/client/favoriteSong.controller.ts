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
    select: "title avatar singers singerGroups slug like",
    populate: [
      { path: "singers", select: "stageName slug" },
      { path: "singerGroups", select: "name slug" },
    ],
  });

  res.render("client/pages/favoriteSong/favoriteSong.view.ejs", {
    pageTitle: "Playlist yêu thích của tôi",
    favoriteSongList,
    keyword: "",
  });
};

type TFavoriteSongController = {
  getAllFavoriteSongGet: (req: Request, res: Response) => Promise<void>;
};

const favoriteSongController: TFavoriteSongController = {
  getAllFavoriteSongGet,
};

export default favoriteSongController;
