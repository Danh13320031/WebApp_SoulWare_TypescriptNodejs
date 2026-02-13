import { Request, Response } from "express";
import convertTextToSlug from "../../helpers/client/search/convertTextToSlug.helper";
import SongModel from "../../models/song.model";

// [GET]: /search/result
const getAllSearchResultGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const keyword: string = (req.query.keyword as string) || "";
  let newSearchedSongList: any[] = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const slug = convertTextToSlug(keyword);
    const slugRegex = new RegExp(slug, "i");

    const searchedSongList = await SongModel.find({
      $or: [
        { title: { $regex: keywordRegex } },
        { slug: { $regex: slugRegex } },
      ],
      status: "active",
      deleted: false,
    })
      .select("title avatar singerId slug like")
      .populate("singerId", "stageName slug");

    newSearchedSongList = searchedSongList;
  }

  res.render("client/pages/search/search.view.ejs", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword,
    newSearchedSongList,
  });
};

type ISearchController = {
  getAllSearchResultGet: (req: Request, res: Response) => Promise<void>;
};

const searchController: ISearchController = {
  getAllSearchResultGet,
};

export default searchController;
